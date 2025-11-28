"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceOrderController_1 = require("../controllers/serviceOrderController");
const router = express_1.default.Router();
// Rotas CRUD para Ordens de Serviço
router.post("/service-orders", serviceOrderController_1.createServiceOrder);
router.get("/service-orders", serviceOrderController_1.getAllServiceOrders);
router.get("/service-orders/search", serviceOrderController_1.searchServiceOrdersByTitle);
router.get("/service-orders/:id", serviceOrderController_1.getServiceOrderById);
router.put("/service-orders/:id", serviceOrderController_1.updateServiceOrder);
router.patch("/service-orders/:id/status", serviceOrderController_1.updateServiceOrderStatus);
router.delete("/service-orders/:id", serviceOrderController_1.deleteServiceOrder);
exports.default = router;
