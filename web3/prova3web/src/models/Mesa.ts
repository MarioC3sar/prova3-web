import mongoose, { Schema, Document } from 'mongoose';

export interface IMesa extends Document {
  numero: number;
  capacidade: number;
  localizacao: 'salão' | 'varanda' | 'área interna';
}

const MesaSchema: Schema = new Schema({
  numero: {
    type: Number,
    required: [true, 'O número da mesa é obrigatório'],
    unique: true
  },
  capacidade: {
    type: Number,
    required: [true, 'A capacidade da mesa é obrigatória'],
    min: [1, 'A capacidade deve ser no mínimo 1']
  },
  localizacao: {
    type: String,
    required: [true, 'A localização da mesa é obrigatória'],
    enum: ['salão', 'varanda', 'área interna']
  }
}, {
  timestamps: true
});

export default mongoose.model<IMesa>('Mesa', MesaSchema);
