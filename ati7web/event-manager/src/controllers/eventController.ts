import { Request, Response } from 'express';
import Event from '../models/Event';

// Criar um novo evento
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, descricao, data, local, valor } = req.body;

    const event = new Event({
      titulo,
      descricao,
      data,
      local,
      valor,
    });

    const savedEvent = await event.save();
    res.status(201).json({
      success: true,
      message: 'Evento criado com sucesso!',
      data: savedEvent,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar evento',
      error: error.message,
    });
  }
};

// Listar todos os eventos
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find().sort({ data: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar eventos',
      error: error.message,
    });
  }
};

// Buscar evento por ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Evento não encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar evento',
      error: error.message,
    });
  }
};

// Pesquisar eventos por título
export const searchEventsByTitle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo } = req.query;
    
    if (!titulo) {
      res.status(400).json({
        success: false,
        message: 'Parâmetro "titulo" é obrigatório',
      });
      return;
    }

    const events = await Event.find({
      titulo: { $regex: titulo, $options: 'i' },
    }).sort({ data: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao pesquisar eventos',
      error: error.message,
    });
  }
};

// Atualizar evento
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, descricao, data, local, valor } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { titulo, descricao, data, local, valor },
      { new: true, runValidators: true }
    );

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Evento não encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Evento atualizado com sucesso!',
      data: event,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar evento',
      error: error.message,
    });
  }
};

// Deletar evento
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Evento não encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Evento excluído com sucesso!',
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir evento',
      error: error.message,
    });
  }
};
