"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceOrderStatus = exports.deleteServiceOrder = exports.updateServiceOrder = exports.searchServiceOrdersByTitle = exports.getServiceOrderById = exports.getAllServiceOrders = exports.createServiceOrder = void 0;
const ServiceOrder_1 = __importDefault(require("../models/ServiceOrder"));
// Criar uma nova ordem de serviço
const createServiceOrder = async (req, res) => {
    try {
        const { titulo, descricao, status, prioridade, responsavel, setorSolicitante, prazoEstimado, valorServico, } = req.body;
        const serviceOrder = new ServiceOrder_1.default({
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Erro ao criar ordem de serviço",
            error: error.message,
        });
    }
};
exports.createServiceOrder = createServiceOrder;
// Listar todas as ordens de serviço
const getAllServiceOrders = async (req, res) => {
    try {
        const { status, prioridade, setorSolicitante } = req.query;
        // Filtros opcionais
        const filter = {};
        if (status)
            filter.status = status;
        if (prioridade)
            filter.prioridade = prioridade;
        if (setorSolicitante)
            filter.setorSolicitante = { $regex: setorSolicitante, $options: "i" };
        const serviceOrders = await ServiceOrder_1.default.find(filter).sort({
            dataAbertura: -1,
        });
        res.status(200).json({
            success: true,
            count: serviceOrders.length,
            data: serviceOrders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao buscar ordens de serviço",
            error: error.message,
        });
    }
};
exports.getAllServiceOrders = getAllServiceOrders;
// Buscar ordem de serviço por ID
const getServiceOrderById = async (req, res) => {
    try {
        const serviceOrder = await ServiceOrder_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao buscar ordem de serviço",
            error: error.message,
        });
    }
};
exports.getServiceOrderById = getServiceOrderById;
// Pesquisar ordens de serviço por título
const searchServiceOrdersByTitle = async (req, res) => {
    try {
        const { titulo } = req.query;
        if (!titulo) {
            res.status(400).json({
                success: false,
                message: 'Parâmetro "titulo" é obrigatório',
            });
            return;
        }
        const serviceOrders = await ServiceOrder_1.default.find({
            titulo: { $regex: titulo, $options: "i" },
        }).sort({ dataAbertura: -1 });
        res.status(200).json({
            success: true,
            count: serviceOrders.length,
            data: serviceOrders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao pesquisar ordens de serviço",
            error: error.message,
        });
    }
};
exports.searchServiceOrdersByTitle = searchServiceOrdersByTitle;
// Atualizar ordem de serviço
const updateServiceOrder = async (req, res) => {
    try {
        const { titulo, descricao, status, prioridade, responsavel, setorSolicitante, prazoEstimado, valorServico, } = req.body;
        const serviceOrder = await ServiceOrder_1.default.findByIdAndUpdate(req.params.id, {
            titulo,
            descricao,
            status,
            prioridade,
            responsavel,
            setorSolicitante,
            prazoEstimado,
            valorServico,
        }, { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Erro ao atualizar ordem de serviço",
            error: error.message,
        });
    }
};
exports.updateServiceOrder = updateServiceOrder;
// Deletar ordem de serviço
const deleteServiceOrder = async (req, res) => {
    try {
        const serviceOrder = await ServiceOrder_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao excluir ordem de serviço",
            error: error.message,
        });
    }
};
exports.deleteServiceOrder = deleteServiceOrder;
// Atualizar status de uma ordem de serviço
const updateServiceOrderStatus = async (req, res) => {
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
                message: "Status inválido. Valores permitidos: aberta, em andamento, concluída",
            });
            return;
        }
        const serviceOrder = await ServiceOrder_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Erro ao atualizar status",
            error: error.message,
        });
    }
};
exports.updateServiceOrderStatus = updateServiceOrderStatus;
