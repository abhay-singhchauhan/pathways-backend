"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/google', auth_controller_1.googleAuth);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map