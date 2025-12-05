import mongoose, { Schema, Document } from 'mongoose';

export interface IReserva extends Document {
  nomeCliente: string;
  contatoCliente: string;
  numeroMesa: number;
  quantidadePessoas: number;
  dataHora: Date;
  observacoes?: string;
  status: 'reservado' | 'ocupado' | 'finalizado' | 'cancelado';
  duracao: number; // em minutos
}

const ReservaSchema: Schema = new Schema({
  nomeCliente: {
    type: String,
    required: [true, 'O nome do cliente é obrigatório'],
    trim: true
  },
  contatoCliente: {
    type: String,
    required: [true, 'O contato do cliente é obrigatório'],
    trim: true
  },
  numeroMesa: {
    type: Number,
    required: [true, 'O número da mesa é obrigatório']
  },
  quantidadePessoas: {
    type: Number,
    required: [true, 'A quantidade de pessoas é obrigatória'],
    min: [1, 'A quantidade de pessoas deve ser no mínimo 1']
  },
  dataHora: {
    type: Date,
    required: [true, 'A data e hora da reserva são obrigatórias']
  },
  observacoes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['reservado', 'ocupado', 'finalizado', 'cancelado'],
    default: 'reservado'
  },
  duracao: {
    type: Number,
    default: 90 // 1h30 em minutos
  }
}, {
  timestamps: true
});

// Índice composto para verificar conflitos de horário
ReservaSchema.index({ numeroMesa: 1, dataHora: 1 });

export default mongoose.model<IReserva>('Reserva', ReservaSchema);
