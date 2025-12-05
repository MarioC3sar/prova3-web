import { Request, Response } from "express";
import Mesa from "../models/Mesa.js";
import { log } from "../utils/logger.js";

export const criarMesa = async (req: Request, res: Response) => {
  try {
    const mesa = new Mesa(req.body);
    await mesa.save();
    log(
      `Mesa criada: Número ${mesa.numero}, Capacidade ${mesa.capacidade}, Localização ${mesa.localizacao}`
    );
    res.status(201).json({
      success: true,
      message: "Mesa criada com sucesso",
      data: mesa,
    });
  } catch (error: any) {
    log(`Erro ao criar mesa: ${error.message}`);
    res.status(400).json({
      success: false,
      message: "Erro ao criar mesa",
      error: error.message,
    });
  }
};

export const listarMesas = async (req: Request, res: Response) => {
  try {
    const mesas = await Mesa.find().sort({ numero: 1 });
    res.json({
      success: true,
      data: mesas,
    });
  } catch (error: any) {
    log(`Erro ao listar mesas: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Erro ao listar mesas",
      error: error.message,
    });
  }
};

export const obterMesa = async (req: Request, res: Response) => {
  try {
    const mesa = await Mesa.findById(req.params.id);
    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa não encontrada",
      });
    }
    res.json({
      success: true,
      data: mesa,
    });
  } catch (error: any) {
    log(`Erro ao obter mesa: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Erro ao obter mesa",
      error: error.message,
    });
  }
};

export const atualizarMesa = async (req: Request, res: Response) => {
  try {
    const mesa = await Mesa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa não encontrada",
      });
    }
    log(`Mesa atualizada: Número ${mesa.numero}`);
    res.json({
      success: true,
      message: "Mesa atualizada com sucesso",
      data: mesa,
    });
  } catch (error: any) {
    log(`Erro ao atualizar mesa: ${error.message}`);
    res.status(400).json({
      success: false,
      message: "Erro ao atualizar mesa",
      error: error.message,
    });
  }
};

export const deletarMesa = async (req: Request, res: Response) => {
  try {
    const mesa = await Mesa.findByIdAndDelete(req.params.id);
    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa não encontrada",
      });
    }
    log(`Mesa deletada: Número ${mesa.numero}`);
    res.json({
      success: true,
      message: "Mesa deletada com sucesso",
    });
  } catch (error: any) {
    log(`Erro ao deletar mesa: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar mesa",
      error: error.message,
    });
  }
};
