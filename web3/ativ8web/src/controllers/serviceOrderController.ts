import { Request, Response } from "express";
import ServiceOrder from "../models/ServiceOrder";

// Criar uma nova ordem de serviço
export const createServiceOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      titulo,
      descricao,
      status,
      prioridade,
      responsavel,
      setorSolicitante,
      prazoEstimado,
      valorServico,
    } = req.body;

    const serviceOrder = new ServiceOrder({
      titulo,
      descricao,
      status: status || "aberta",
      prioridade,
      responsavel,
      setorSolicitante,
      prazoEstimado,
      valorServico,
    });

    const savedOrder = await serviceOrder.save();
    res.status(201).json({
      success: true,
      message: "Ordem de serviço criada com sucesso!",
      data: savedOrder,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Erro ao criar ordem de serviço",
      error: error.message,
    });
  }
};

// Listar todas as ordens de serviço
export const getAllServiceOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, prioridade, setorSolicitante } = req.query;

    // Filtros opcionais
    const filter: any = {};
    if (status) filter.status = status;
    if (prioridade) filter.prioridade = prioridade;
    if (setorSolicitante)
      filter.setorSolicitante = { $regex: setorSolicitante, $options: "i" };

    const serviceOrders = await ServiceOrder.find(filter).sort({
      dataAbertura: -1,
    });
    res.status(200).json({
      success: true,
      count: serviceOrders.length,
      data: serviceOrders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar ordens de serviço",
      error: error.message,
    });
  }
};

// Buscar ordem de serviço por ID
export const getServiceOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const serviceOrder = await ServiceOrder.findById(req.params.id);

    if (!serviceOrder) {
      res.status(404).json({
        success: false,
        message: "Ordem de serviço não encontrada",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: serviceOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar ordem de serviço",
      error: error.message,
    });
  }
};

// Pesquisar ordens de serviço por título
export const searchServiceOrdersByTitle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { titulo } = req.query;

    if (!titulo) {
      res.status(400).json({
        success: false,
        message: 'Parâmetro "titulo" é obrigatório',
      });
      return;
    }

    const serviceOrders = await ServiceOrder.find({
      titulo: { $regex: titulo, $options: "i" },
    }).sort({ dataAbertura: -1 });

    res.status(200).json({
      success: true,
      count: serviceOrders.length,
      data: serviceOrders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Erro ao pesquisar ordens de serviço",
      error: error.message,
    });
  }
};

// Atualizar ordem de serviço
export const updateServiceOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      titulo,
      descricao,
      status,
      prioridade,
      responsavel,
      setorSolicitante,
      prazoEstimado,
      valorServico,
    } = req.body;

    const serviceOrder = await ServiceOrder.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        descricao,
        status,
        prioridade,
        responsavel,
        setorSolicitante,
        prazoEstimado,
        valorServico,
      },
      { new: true, runValidators: true }
    );

    if (!serviceOrder) {
      res.status(404).json({
        success: false,
        message: "Ordem de serviço não encontrada",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Ordem de serviço atualizada com sucesso!",
      data: serviceOrder,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Erro ao atualizar ordem de serviço",
      error: error.message,
    });
  }
};

// Deletar ordem de serviço
export const deleteServiceOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const serviceOrder = await ServiceOrder.findByIdAndDelete(req.params.id);

    if (!serviceOrder) {
      res.status(404).json({
        success: false,
        message: "Ordem de serviço não encontrada",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Ordem de serviço excluída com sucesso!",
      data: serviceOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Erro ao excluir ordem de serviço",
      error: error.message,
    });
  }
};

// Atualizar status de uma ordem de serviço
export const updateServiceOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: 'O campo "status" é obrigatório',
      });
      return;
    }

    const validStatuses = ["aberta", "em andamento", "concluída"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message:
          "Status inválido. Valores permitidos: aberta, em andamento, concluída",
      });
      return;
    }

    const serviceOrder = await ServiceOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!serviceOrder) {
      res.status(404).json({
        success: false,
        message: "Ordem de serviço não encontrada",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Status atualizado com sucesso!",
      data: serviceOrder,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Erro ao atualizar status",
      error: error.message,
    });
  }
};
