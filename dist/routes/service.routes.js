"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_1 = require("../controllers/service.controller");
const router = (0, express_1.Router)();
router.post('/', service_controller_1.createService);
router.get('/', service_controller_1.getAllServices);
router.get('/:id', service_controller_1.getServiceById);
router.put('/:id', service_controller_1.updateService);
router.delete('/:id', service_controller_1.deleteService);
exports.default = router;
//# sourceMappingURL=service.routes.js.map