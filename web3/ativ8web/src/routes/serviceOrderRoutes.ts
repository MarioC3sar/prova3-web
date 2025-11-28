import express from "express";
import {
  createServiceOrder,
  getAllServiceOrders,
  getServiceOrderById,
  searchServiceOrdersByTitle,
  updateServiceOrder,
  deleteServiceOrder,
  updateServiceOrderStatus,
} from "../controllers/serviceOrderController";

const router = express.Router();

// Rotas CRUD para Ordens de Serviço
router.post("/service-orders", createServiceOrder);
router.get("/service-orders", getAllServiceOrders);
router.get("/service-orders/search", searchServiceOrdersByTitle);
router.get("/service-orders/:id", getServiceOrderById);
router.put("/service-orders/:id", updateServiceOrder);
router.patch("/service-orders/:id/status", updateServiceOrderStatus);
router.delete("/service-orders/:id", deleteServiceOrder);

export default router;
