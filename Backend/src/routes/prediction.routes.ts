import { Router } from 'express';
import { predictSingle, getPredictionStatus } from '../controllers/prediction.controller';

const router = Router();

// POST /api/predict          — { sequence: string }
router.post('/', predictSingle);


router.get('/status/:jobId', getPredictionStatus);


export default router;