import { Router } from 'express';
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  validatePayment,
  assignTherapist,
  updateStatus
} from '../controllers/session.controller';
import { authorize, protect } from '../middleware/auth.middleware';

const router = Router();



router.use(protect);

router.post('/assign-therapist', authorize('admin'), assignTherapist);    
router.post('/update-status', authorize('therapist', 'admin'), updateStatus);
router.post('/', createSession);
router.get('/', getAllSessions);
router.post('/verify-payment', validatePayment);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);


export default router; 