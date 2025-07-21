import { Router } from 'express';
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession
} from '../controllers/session.controller';

const router = Router();

router.post('/', createSession);
router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router; 