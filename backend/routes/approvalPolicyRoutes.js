import express from 'express';
import {
  getApprovalPolicy,
  upsertApprovalPolicy,
  toggleApprovalPolicy,
  addRule,
  updateRule,
  deleteRule,
  updateChecklistTemplate,
  getPolicyTemplates,
  applyTemplate,
} from '../controllers/approvalPolicyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes (with auth)
router.get('/templates', protect, getPolicyTemplates);

// Project-specific routes
router.get('/:projectId', protect, getApprovalPolicy);
router.put('/:projectId', protect, upsertApprovalPolicy);
router.patch('/:projectId/toggle', protect, toggleApprovalPolicy);
router.post('/:projectId/apply-template', protect, applyTemplate);

// Rules management
router.post('/:projectId/rules', protect, addRule);
router.put('/:projectId/rules/:ruleId', protect, updateRule);
router.delete('/:projectId/rules/:ruleId', protect, deleteRule);

// Checklist templates
router.put('/:projectId/checklist/:taskType', protect, updateChecklistTemplate);

export default router;
