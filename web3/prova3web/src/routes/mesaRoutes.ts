import express from "express";
import {
  criarMesa,
  listarMesas,
  obterMesa,
  atualizarMesa,
  deletarMesa,
} from "../controllers/mesaController";

const router = express.Router();

router.post("/", criarMesa);
router.get("/", listarMesas);
router.get("/:id", obterMesa);
router.put("/:id", atualizarMesa);
router.delete("/:id", deletarMesa);

export default router;
