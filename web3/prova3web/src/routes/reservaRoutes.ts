import express from "express";
import {
  criarReserva,
  listarReservas,
  obterReserva,
  atualizarReserva,
  cancelarReserva,
  deletarReserva,
  obterStatusMesas,
} from "../controllers/reservaController";

const router = express.Router();

router.post("/", criarReserva);
router.get("/", listarReservas);
router.get("/status-mesas", obterStatusMesas);
router.get("/:id", obterReserva);
router.put("/:id", atualizarReserva);
router.patch("/:id/cancelar", cancelarReserva);
router.delete("/:id", deletarReserva);

export default router;
