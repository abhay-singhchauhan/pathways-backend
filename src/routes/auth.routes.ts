import { googleAuth } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post('/google', googleAuth);

export default router;