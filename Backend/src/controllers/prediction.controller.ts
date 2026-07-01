import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../config/redis';

const ML_URL     = process.env.ML_SERVICE_URL || 'http://localhost:8000';
// 120s default — ProtT5 on GPU is fast; on CPU leave headroom.
// Override via ML_TIMEOUT_MS in .env for your deployment target.
const ML_TIMEOUT = parseInt(process.env.ML_TIMEOUT_MS || '3000000', 10);

export const predictSingle = async (
  req: Request,
  res: Response
): Promise<void> => {

  const { sequence } = req.body;

  if (!sequence || typeof sequence !== 'string' || !sequence.trim()) {
    res.status(400).json({
      success: false,
      error: 'Missing required field: sequence'
    });
    return;
  }

  const jobId = uuidv4();

  await redisClient.set(
    `job:${jobId}`,
    JSON.stringify({
      status: 'QUEUED'
    }),
    {
      EX: 3600
    }
  );

  res.status(202).json({
    success: true,
    jobId,
    status: 'QUEUED'
  });

  void (async () => {
    try {

      await redisClient.set(
        `job:${jobId}`,
        JSON.stringify({
          status: 'RUNNING'
        }),
        {
          EX: 3600
        }
      );

      const { data } = await axios.post(
        `${ML_URL}/predict`,
        {
          sequence: sequence.trim()
        },
        {
          timeout: ML_TIMEOUT
        }
      );

      await redisClient.set(
        `job:${jobId}`,
        JSON.stringify({
          status: 'COMPLETED',
          result: data
        }),
        {
          EX: 3600
        }
      );

    } catch (error) {
      const reason =
        error instanceof AxiosError
          ? error.response?.data?.detail || error.code || error.message
          : error instanceof Error
          ? error.message
          : 'Prediction failed';

      await redisClient.set(
        `job:${jobId}`,
        JSON.stringify({
          status: 'FAILED',
          error: reason,
        }),
        {
          EX: 3600
        }
      );
    }
  })();
};


// ── GET /api/predict/status/:jobId ─────────────────────────────────────────


export const getPredictionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {

  const { jobId } = req.params;
  console.log(jobId);

  const data = await redisClient.get(`job:${jobId}`);

  if (!data) {
    res.status(404).json({
      success: false,
      error: 'Job not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: JSON.parse(data)
  });
};