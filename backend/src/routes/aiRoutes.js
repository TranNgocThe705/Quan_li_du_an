import express from 'express';
import {
  suggestAssignee,
  predictDeadline,
  getProjectInsights,
  analyzeSentiment,
  testAI,
  chatWithAI
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Test AI connection
router.get('/test', protect, testAI);

// AI Task Assistant
router.post('/suggest-assignee', protect, suggestAssignee);
router.post('/predict-deadline', protect, predictDeadline);

// AI Project Insights
router.get('/project-insights/:projectId', protect, getProjectInsights);

// AI Sentiment Analysis
router.post('/analyze-sentiment', protect, analyzeSentiment);

// AI Chat
router.post('/chat', protect, chatWithAI);

export default router;
