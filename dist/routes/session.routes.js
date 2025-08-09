"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = require("../controllers/session.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post('/assign-therapist', (0, auth_middleware_1.authorize)('admin'), session_controller_1.assignTherapist);
router.post('/update-status', (0, auth_middleware_1.authorize)('therapist', 'admin'), session_controller_1.updateStatus);
router.post('/', session_controller_1.createSession);
router.get('/', session_controller_1.getAllSessions);
router.post('/verify-payment', session_controller_1.validatePayment);
router.get('/:id', session_controller_1.getSessionById);
router.put('/:id', session_controller_1.updateSession);
router.delete('/:id', session_controller_1.deleteSession);
exports.default = router;
//# sourceMappingURL=session.routes.js.map