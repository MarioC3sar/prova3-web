import { Request, Response } from "express";
import Reserva from "../models/Reserva";
import Mesa from "../models/Mesa";
import { log } from "../utils/logger";

// Verifica se há conflito de horário para a mesa
const verificarConflito = async (
  numeroMesa: number,
  dataHora: Date,
  duracao: number,
  reservaId?: string
) => {
  const inicioReserva = new Date(dataHora);
  const fimReserva = new Date(inicioReserva.getTime() + duracao * 60000);

  const query: any = {
    numeroMesa,
    status: { $in: ["reservado", "ocupado"] },
  };

  if (reservaId) {
    query._id = { $ne: reservaId };
  }

  const reservasExistentes = await Reserva.find(query);

  for (const reserva of reservasExistentes) {
    const inicioExistente = new Date(reserva.dataHora);
    const fimExistente = new Date(
      inicioExistente.getTime() + reserva.duracao * 60000
    );

    if (
      (inicioReserva >= inicioExistente && inicioReserva < fimExistente) ||
      (fimReserva > inicioExistente && fimReserva <= fimExistente) ||
      (inicioReserva <= inicioExistente && fimReserva >= fimExistente)
    ) {
      return true;
    }
  }

  return false;
};

export const criarReserva = async (req: Request, res: Response) => {
  try {
    const {
      nomeCliente,
      contatoCliente,
      numeroMesa,
      quantidadePessoas,
      dataHora,
      observacoes,
      duracao,
    } = req.body;

    // Validação: antecedência mínima de 1 hora
    const agora = new Date();
    const dataReserva = new Date(dataHora);
    const diferencaHoras =
      (dataReserva.getTime() - agora.getTime()) / (1000 * 60 * 60);

    if (diferencaHoras < 1) {
      return res.status(400).json({
        success: false,
        message: "A reserva deve ser feita com antecedência mínima de 1 hora",
      });
    }

    // Validação: horário de funcionamento (19h às 23h)
    const horaReserva = dataReserva.getHours();
    const minutoReserva = dataReserva.getMinutes();
    const duracaoReserva = duracao || 90;
    const fimReserva = new Date(dataReserva.getTime() + duracaoReserva * 60000);
    const horaFim = fimReserva.getHours();
    const minutoFim = fimReserva.getMinutes();

    if (horaReserva < 19 || horaReserva >= 23) {
      return res.status(400).json({
        success: false,
        message:
          "O restaurante funciona apenas das 19h às 23h. Por favor, escolha um horário dentro deste período.",
      });
    }

    // Verifica se a reserva termina antes das 23h
    if (horaFim > 23 || (horaFim === 23 && minutoFim > 0)) {
      return res.status(400).json({
        success: false,
        message:
          "A reserva deve terminar até às 23h. Escolha um horário mais cedo ou reduza a duração.",
      });
    }

    // Verifica se a mesa existe
    const mesa = await Mesa.findOne({ numero: numeroMesa });
    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa não encontrada",
      });
    }

    // Validação: capacidade da mesa
    if (quantidadePessoas > mesa.capacidade) {
      return res.status(400).json({
        success: false,
        message: `A mesa ${numeroMesa} comporta apenas ${mesa.capacidade} pessoas`,
      });
    }

    // Validação: conflito de horário
    const conflito = await verificarConflito(
      numeroMesa,
      dataReserva,
      duracaoReserva
    );
    if (conflito) {
      return res.status(400).json({
        success: false,
        message: "Já existe uma reserva para esta mesa neste horário",
      });
    }

    const reserva = new Reserva({
      nomeCliente,
      contatoCliente,
      numeroMesa,
      quantidadePessoas,
      dataHora: dataReserva,
      observacoes,
      duracao: duracaoReserva,
      status: "reservado",
    });

    await reserva.save();
    log(
      `Reserva criada: Cliente ${nomeCliente}, Mesa ${numeroMesa}, Data ${dataReserva.toLocaleString(
        "pt-BR"
      )}`
    );

    res.status(201).json({
      success: true,
      message: "Reserva criada com sucesso",
      data: reserva,
    });
  } catch (error: any) {
    log(`Erro ao criar reserva: ${error.message}`);
    res.status(400).json({
      success: false,
      message: "Erro ao criar reserva",
      error: error.message,
    });
  }
};

export const listarReservas = async (req: Request, res: Response) => {
  try {
    const { cliente, mesa, data, status } = req.query;
    const filtro: any = {};

    if (cliente) {
      filtro.nomeCliente = { $regex: cliente, $options: "i" };
    }
    if (mesa) {
      filtro.numeroMesa = Number(mesa);
    }
    if (data) {
      const dataInicio = new Date(data as string);
      const dataFim = new Date(dataInicio);
      dataFim.setDate(dataFim.getDate() + 1);
      filtro.dataHora = { $gte: dataInicio, $lt: dataFim };
    }
    if (status) {
      filtro.status = status;
    }

    const reservas = await Reserva.find(filtro).sort({ dataHora: 1 });
    res.json({
      success: true,
      data: reservas,
    });
  } catch (error: any) {
    log(`Erro ao listar reservas: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Erro ao listar reservas",
      error: error.message,
    });
  }
};

export const obterReserva = async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva não encontrada",
      });
    }
    res.json({
      success: true,
      data: reserva,
    });
  } catch (error: any) {
    log(`Erro ao obter reserva: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Erro ao obter reserva",
      error: error.message,
    });
  }
};

export const atualizarReserva = async (req: Request, res: Response) => {
  try {
    const reservaId = req.params.id;
    const { numeroMesa, dataHora, duracao, quantidadePessoas } = req.body;

    const reservaAtual = await Reserva.findById(reservaId);
    if (!reservaAtual) {
      return res.status(404).json({
        success: false,
        message: "Reserva não encontrada",
      });
    }

    // Se alterar mesa, data ou duração, verificar conflitos
    if (numeroMesa || dataHora || duracao) {
      const novoNumeroMesa = numeroMesa || reservaAtual.numeroMesa;
      const novaDataHora = dataHora
        ? new Date(dataHora)
        : reservaAtual.dataHora;
      const novaDuracao = duracao || reservaAtual.duracao;

      // Validação: horário de funcionamento (19h às 23h)
      const horaReserva = novaDataHora.getHours();
      const minutoReserva = novaDataHora.getMinutes();
      const fimReserva = new Date(novaDataHora.getTime() + novaDuracao * 60000);
      const horaFim = fimReserva.getHours();
      const minutoFim = fimReserva.getMinutes();

      if (horaReserva < 19 || horaReserva >= 23) {
        return res.status(400).json({
          success: false,
          message:
            "O restaurante funciona apenas das 19h às 23h. Por favor, escolha um horário dentro deste período.",
        });
      }

      if (horaFim > 23 || (horaFim === 23 && minutoFim > 0)) {
        return res.status(400).json({
          success: false,
          message:
            "A reserva deve terminar até às 23h. Escolha um horário mais cedo ou reduza a duração.",
        });
      }

      // Verifica se a mesa existe
      const mesa = await Mesa.findOne({ numero: novoNumeroMesa });
      if (!mesa) {
        return res.status(404).json({
          success: false,
          message: "Mesa não encontrada",
        });
      }

      // Validação: capacidade da mesa
      const novaQuantidade =
        quantidadePessoas || reservaAtual.quantidadePessoas;
      if (novaQuantidade > mesa.capacidade) {
        return res.status(400).json({
          success: false,
          message: `A mesa ${novoNumeroMesa} comporta apenas ${mesa.capacidade} pessoas`,
        });
      }

      const conflito = await verificarConflito(
        novoNumeroMesa,
        novaDataHora,
        novaDuracao,
        reservaId
      );
      if (conflito) {
        return res.status(400).json({
          success: false,
          message: "Já existe uma reserva para esta mesa neste horário",
        });
      }
    }

    const reserva = await Reserva.findByIdAndUpdate(reservaId, req.body, {
      new: true,
      runValidators: true,
    });

    log(`Reserva atualizada: ID ${reservaId}, Cliente ${reserva!.nomeCliente}`);

    res.json({
      success: true,
      message: "Reserva atualizada com sucesso",
      data: reserva,
    });
  } catch (error: any) {
    log(`Erro ao atualizar reserva: ${error.message}`);
    res.status(400).json({
      success: false,
      message: "Erro ao atualizar reserva",
      error: error.message,
    });
  }
};

export const cancelarReserva = async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(
      req.params.id,
      { status: "cancelado" },
      { new: true }
    );

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva não encontrada",
      });
    }

    log(
      `Reserva cancelada: ID ${req.params.id}, Cliente ${reserva.nomeCliente}`
    );

    res.json({
      success: true,
      message: "Reserva cancelada com sucesso",
      data: reserva,
    });
  } catch (error: any) {
    log(`Erro ao cancelar reserva: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Erro ao cancelar reserva",
      error: error.message,
    });
  }
};

export const deletarReserva = async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.findByIdAndDelete(req.params.id);
    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva não encontrada",
      });
    }

    log(
      `Reserva deletada: ID ${req.params.id}, Cliente ${reserva.nomeCliente}`
    );

    res.json({
      success: true,
      message: "Reserva deletada com sucesso",
    });
  } catch (error: any) {
    log(`Erro ao deletar reserva: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar reserva",
      error: error.message,
    });
  }
};

// Obter status das mesas para o mapa visual
export const obterStatusMesas = async (req: Request, res: Response) => {
  try {
    const mesas = await Mesa.find().sort({ numero: 1 });
    const agora = new Date();

    const mesasComStatus = await Promise.all(
      mesas.map(async (mesa) => {
        // Busca reservas ativas para esta mesa
        const reservas = await Reserva.find({
          numeroMesa: mesa.numero,
          status: { $in: ["reservado", "ocupado"] },
        });

        let status = "disponível";
        let reservaAtual = null;

        for (const reserva of reservas) {
          const inicioReserva = new Date(reserva.dataHora);
          const fimReserva = new Date(
            inicioReserva.getTime() + reserva.duracao * 60000
          );

          if (agora >= inicioReserva && agora <= fimReserva) {
            status = reserva.status;
            reservaAtual = reserva;
            break;
          } else if (agora < inicioReserva) {
            status = "reservado";
            reservaAtual = reserva;
            break;
          }
        }

        return {
          _id: mesa._id,
          numero: mesa.numero,
          capacidade: mesa.capacidade,
          localizacao: mesa.localizacao,
          status,
          reservaAtual,
        };
      })
    );

    res.json({
      success: true,
      data: mesasComStatus,
    });
  } catch (error: any) {
    log(`Erro ao obter status das mesas: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Erro ao obter status das mesas",
      error: error.message,
    });
  }
};
