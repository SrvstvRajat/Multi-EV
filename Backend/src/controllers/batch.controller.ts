import { Request, Response } from "express";
import nodemailer from "nodemailer";
import axios from "axios";

// ── Types ──────────────────────────────────────────────────────────────────────
interface BatchJobRequest {
  name: string;
  email: string;
}

interface PredictionResult {
  smiles: string;
  result: any;
  error?: string;
}

// ── Mailer setup ───────────────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

// ── Helper: extract SMILES from uploaded file ──────────────────────────────────
const extractSmiles = (buffer: Buffer, filename: string): string[] => {
  const content = buffer.toString("utf-8").trim();
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "fasta") {
    // Extract sequences (lines not starting with ">")
    return content
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith(">"))
      .map((l) => l.trim());
  }
  if (ext === "csv") {
    // Assumes first column is SMILES, skip header row
    const lines = content.split("\n").filter((l) => l.trim());
    return lines
      .slice(1)
      .map((l) => l.split(",")[0].trim())
      .filter(Boolean);
  }
  // .txt: one SMILES per line
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
};


const runPredictions = async (smilesList: string[]): Promise<PredictionResult[]> => {
  const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";
  // Override via ML_TIMEOUT_MS in .env.
  const ML_TIMEOUT = parseInt(process.env.ML_TIMEOUT_MS || "300000", 10);
  const CHUNK_SIZE = 50; // matches app.py BatchRequest max
  const results: PredictionResult[] = [];

  for (let i = 0; i < smilesList.length; i += CHUNK_SIZE) {
    const chunk = smilesList.slice(i, i + CHUNK_SIZE);
    try {
      const { data } = await axios.post(
        `${ML_URL}/predict/batch`,
        { sequences: chunk },
        { timeout: ML_TIMEOUT * 3 }
      );

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error("ML service returned unexpected response shape");
      }

      chunk.forEach((seq, idx) => {
        const item = data.results[idx];
        if (item?.prediction && typeof item?.confidence === "number") {
          results.push({
            smiles: seq,
            result: {
              predicted_class: item.prediction,
              confidence: item.confidence,
              probabilities: item.probabilities ?? {},
              sequence_length: item.sequence_length,
            },
          });
        } else {
          results.push({
            smiles: seq,
            result: null,
            error: item?.error || "Incomplete prediction returned",
          });
        }
      });

    } catch (err: any) {
      chunk.forEach((seq) => {
        results.push({ smiles: seq, result: null, error: err.message || "Prediction failed" });
      });
    }
  }

  const allFailed = results.every((r) => r.result === null);
  if (allFailed) {
    throw new Error("All predictions failed — ML pipeline returned no valid results");
  }

  return results;
};


const buildResultsCsv = (results: PredictionResult[]): string => {
  // sequence instead of smiles — this is a protein classifier, not chemistry
  const header = ["sequence", "predicted_class", "confidence", "non_ev_prob", "milk_ev_prob", "plant_ev_prob", "error"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  // Include ALL rows — failed ones get empty prediction fields and a filled error column
  // so the user can see exactly which sequences didn't process rather than silently missing them
  const rows = results.map(({ smiles, result, error }) => [
    escape(smiles),
    escape(result?.predicted_class ?? ""),
    escape(result?.confidence != null ? result.confidence : ""),
    escape(result?.probabilities?.["Non-EV"] ?? ""),
    escape(result?.probabilities?.["Milk-based EV"] ?? ""),
    escape(result?.probabilities?.["Plant-based EV"] ?? ""),
    escape(error ?? ""),
  ]);

  return [header.map(escape), ...rows]
    .map((r) => r.join(","))
    .join("\n");
};



const emailShell = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF2EF;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2EF;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
 
        <!-- Header -->
        <tr>
          <td style="background:#16211C;border-radius:12px 12px 0 0;padding:28px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#1F9E88;font-weight:600;">
              EV · MultiClass
            </p>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#F4F8F5;letter-spacing:-0.5px;">
              MultiEV
            </h1>
            <p style="margin:6px 0 0;font-size:12px;color:#5F6E66;">
              Extracellular Vesicle Protein Source Classifier
            </p>
          </td>
        </tr>
 
        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            ${content}
          </td>
        </tr>
 
        <!-- Footer -->
        <tr>
          <td style="background:#F4F8F5;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;border-top:1px solid #E2E8E4;">
            <p style="margin:0;font-size:12px;color:#8A97A6;">
              CoSyLab · IIIT Delhi &nbsp;·&nbsp;
              <a href="mailto:bagler+multiev@iiitd.ac.in" style="color:#1F9E88;text-decoration:none;">
                bagler+multiev@iiitd.ac.in
              </a>
            </p>
          </td>
        </tr>
 
      </table>
    </td></tr>
  </table>
</body>
</html>
`;
 
// ── Helper: send submission confirmation to user ───────────────────────────────
const sendUserConfirmation = async (
  transporter: nodemailer.Transporter,
  toEmail: string,
  toName: string,
  filename: string,
  sequenceCount: number
) => {
  await transporter.sendMail({
    from: `"MultiEV" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "MultiEV — Batch Job Received",
    html: emailShell(`
      <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#16211C;">
        Job received, ${toName}.
      </h2>
      <p style="margin:0 0 24px;font-size:15px;color:#5F6E66;line-height:1.6;">
        Your batch prediction job has been successfully submitted and is now queued for processing.
      </p>
 
      <!-- Job summary card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F8F5;border:1px solid #E2E8E4;border-radius:8px;margin-bottom:24px;">
        <tr>
          <td style="padding:8px 20px;border-bottom:1px solid #E2E8E4;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8A97A6;">File</p>
            <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#16211C;">${filename}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 20px;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8A97A6;">Sequences</p>
            <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#16211C;">${sequenceCount}</p>
          </td>
        </tr>
      </table>
 
      <p style="margin:0 0 20px;font-size:14px;color:#5F6E66;line-height:1.6;">
        The pipeline will embed each sequence using ProtT5-XL, apply RFE feature selection,
        and classify using the stacked ensemble model. Results will be delivered as a CSV
        attachment in a follow-up email.
      </p>
 
      <!-- What to expect -->
      <div style="border-left:3px solid #1F9E88;padding:12px 16px;background:#F0FAF8;border-radius:0 6px 6px 0;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#16211C;line-height:1.6;">
          <strong>What to expect:</strong> each row in the results CSV will contain the
          original sequence, its predicted class (<em>Non-EV</em>, <em>Milk-based EV</em>,
          or <em>Plant-based EV</em>), confidence score, and per-class probabilities.
        </p>
      </div>
 
      <p style="margin:0;font-size:12px;color:#8A97A6;line-height:1.5;">
        If you did not submit this request, please ignore this email or contact us at
        <a href="mailto:bagler+multiev@iiitd.ac.in" style="color:#1F9E88;">bagler+multiev@iiitd.ac.in</a>.
      </p>
    `),
  });
};



const sendUserResults = async (
  transporter: nodemailer.Transporter,
  toEmail: string,
  toName: string,
  filename: string,
  csvContent: string
) => {
  const resultFilename = filename.replace(/\.[^.]+$/, "_results.csv");
 
  await transporter.sendMail({
    from: `"MultiEV" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "MultiEV — Your Prediction Results Are Ready",
    html:emailShell(`
      <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#16211C;">
        Results ready, ${toName}.
      </h2>
      <p style="margin:0 0 24px;font-size:15px;color:#5F6E66;line-height:1.6;">
        The batch prediction for <strong style="color:#16211C;">${filename}</strong> has completed.
        Your results are attached as <strong style="color:#16211C;">${resultFilename}</strong>.
      </p>
 
      <!-- Result file card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FAF8;border:1px solid #A7D9D0;border-radius:8px;margin-bottom:24px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#1F9E88;font-weight:600;">
              Attached File
            </p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#16211C;">${resultFilename}</p>
          </td>
        </tr>
      </table>
 
      <!-- CSV column guide -->
      <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#16211C;">CSV columns</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8E4;border-radius:8px;overflow:hidden;margin-bottom:24px;font-size:13px;">
        <tr style="background:#F4F8F5;">
          <td style="padding:8px 14px;font-weight:600;color:#16211C;border-bottom:1px solid #E2E8E4;width:40%;">Column</td>
          <td style="padding:8px 14px;color:#5F6E66;border-bottom:1px solid #E2E8E4;">Description</td>
        </tr>
        <tr><td style="padding:8px 14px;font-family:monospace;color:#1F9E88;border-bottom:1px solid #F4F8F5;">sequence</td><td style="padding:8px 14px;color:#5F6E66;border-bottom:1px solid #F4F8F5;">Original input sequence</td></tr>
        <tr><td style="padding:8px 14px;font-family:monospace;color:#1F9E88;border-bottom:1px solid #F4F8F5;background:#FAFCFB;">predicted_class</td><td style="padding:8px 14px;color:#5F6E66;border-bottom:1px solid #F4F8F5;background:#FAFCFB;">Non-EV · Milk-based EV · Plant-based EV</td></tr>
        <tr><td style="padding:8px 14px;font-family:monospace;color:#1F9E88;border-bottom:1px solid #F4F8F5;">confidence</td><td style="padding:8px 14px;color:#5F6E66;border-bottom:1px solid #F4F8F5;">Model confidence (0–1) for the top class</td></tr>
        <tr><td style="padding:8px 14px;font-family:monospace;color:#1F9E88;border-bottom:1px solid #F4F8F5;background:#FAFCFB;">non_ev_prob</td><td style="padding:8px 14px;color:#5F6E66;border-bottom:1px solid #F4F8F5;background:#FAFCFB;">Probability for Non-EV class</td></tr>
        <tr><td style="padding:8px 14px;font-family:monospace;color:#1F9E88;border-bottom:1px solid #F4F8F5;">milk_ev_prob</td><td style="padding:8px 14px;color:#5F6E66;border-bottom:1px solid #F4F8F5;">Probability for Milk-based EV class</td></tr>
        <tr><td style="padding:8px 14px;font-family:monospace;color:#1F9E88;border-bottom:1px solid #F4F8F5;background:#FAFCFB;">plant_ev_prob</td><td style="padding:8px 14px;color:#5F6E66;border-bottom:1px solid #F4F8F5;background:#FAFCFB;">Probability for Plant-based EV class</td></tr>
        <tr><td style="padding:8px 14px;font-family:monospace;color:#D98A46;">error</td><td style="padding:8px 14px;color:#5F6E66;">Non-empty if this sequence could not be processed</td></tr>
      </table>
 
      <p style="margin:0;font-size:12px;color:#8A97A6;line-height:1.5;">
        Questions about your results? Contact us at
        <a href="mailto:bagler+multiev@iiitd.ac.in" style="color:#1F9E88;">bagler+multiev@iiitd.ac.in</a>.
      </p>
    `),
    attachments: [
      {
        filename: resultFilename,
        content: Buffer.from(csvContent, "utf-8"),
        contentType: "text/csv",
      },
    ],
  });
};

// ── Helper: send job notification to admin ─────────────────────────────────────
const sendAdminNotification = async (
  transporter: nodemailer.Transporter,
  userName: string,
  userEmail: string,
  filename: string,
  fileBuffer: Buffer,
  mimetype: string,
  sequenceCount: number
) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER!;
  const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
 
  await transporter.sendMail({
    from: `"MultiEV Jobs" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `[MultiEV] New Batch Job — ${userName} (${sequenceCount} sequences)`,
    html: emailShell(`
      <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#16211C;">
        New Batch Job Submitted
      </h2>
      <p style="margin:0 0 24px;font-size:14px;color:#5F6E66;">
        The system is processing this job automatically. Results will be emailed to the user on completion.
      </p>
 
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F8F5;border:1px solid #E2E8E4;border-radius:8px;margin-bottom:24px;font-size:14px;">
        <tr>
          <td style="padding:10px 20px;border-bottom:1px solid #E2E8E4;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8A97A6;">Submitted by</p>
            <p style="margin:4px 0 0;font-weight:600;color:#16211C;">
              ${userName} &lt;<a href="mailto:${userEmail}" style="color:#1F9E88;text-decoration:none;">${userEmail}</a>&gt;
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 20px;border-bottom:1px solid #E2E8E4;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8A97A6;">File</p>
            <p style="margin:4px 0 0;font-weight:600;color:#16211C;">${filename}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 20px;border-bottom:1px solid #E2E8E4;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8A97A6;">Sequences</p>
            <p style="margin:4px 0 0;font-weight:600;color:#16211C;">${sequenceCount}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 20px;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8A97A6;">Submitted at</p>
            <p style="margin:4px 0 0;font-weight:600;color:#16211C;">${submittedAt} IST</p>
          </td>
        </tr>
      </table>
 
      <p style="margin:0;font-size:12px;color:#8A97A6;">
        The original file is attached for reference.
      </p>
    `),
    attachments: [
      {
        filename,
        content: fileBuffer,
        contentType: mimetype,
      },
    ],
  });
};
// ── Controller ─────────────────────────────────────────────────────────────────
export const submitBatchJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email }: BatchJobRequest = req.body;
    console.log("Received batch job request:", {
      name,
      email,
      file: req.file?.originalname,
    });

    // ── Validation ──────────────────────────────────────────────────────────────
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: "Full name is required." });
      return;
    }
    if (!email || !email.trim()) {
      res.status(400).json({ success: false, message: "Email address is required." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: "Please provide a valid email address." });
      return;
    }
    if (!req.file) {
      res.status(400).json({ success: false, message: "Please upload a sequence file." });
      return;
    }

    const { originalname, buffer, mimetype } = req.file;
    const smilesList = extractSmiles(buffer, originalname);
    const sequenceCount = smilesList.length;

    if (sequenceCount === 0) {
      res.status(400).json({ success: false, message: "The uploaded file contains no valid sequences." });
      return;
    }
    if (sequenceCount > 50) {
      res.status(400).json({
        success: false,
        message: `Your file contains ${sequenceCount} sequences. Maximum allowed is 50 per batch job.`,
      });
      return;
    }

    const transporter = createTransporter();

    // ── Step 1: Confirm receipt + notify admin (in parallel) ───────────────────
    await Promise.all([
      sendUserConfirmation(transporter, email, name, originalname, sequenceCount),
      sendAdminNotification(transporter, name, email, originalname, buffer, mimetype, sequenceCount),
    ]);

    // ── Step 2: Respond immediately so the user isn't kept waiting ─────────────
    res.status(200).json({
      success: true,
      message: `Batch job submitted! A confirmation has been sent to ${email}. Your results will follow in a separate email once processing is complete.`,
      data: {
        filename: originalname,
        sequenceCount,
        submittedAt: new Date().toISOString(),
      },
    });

    // ── Step 3: Process predictions + email results asynchronously ─────────────
    // Fire-and-forget: runs after response is sent, errors are logged not thrown.
    (async () => {
      try {
        console.log(`[BatchJob] Starting predictions for ${sequenceCount} sequences (${originalname}) → ${email}`);
        const predictions = await runPredictions(smilesList);
        const csv = buildResultsCsv(predictions);
        await sendUserResults(transporter, email, name, originalname, csv);
        console.log(`[BatchJob] Results sent to ${email} for job: ${originalname}`);
      } catch (err) {
        console.error(`[BatchJob] Failed to process/send results for ${email} (${originalname}):`, err);
      }
    })();

  } catch (error: any) {
    console.error("Batch job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit batch job. Please try again or contact support.",
    });
  }
};