import mongoose, { Schema, Document } from "mongoose";

export interface IServiceOrder extends Document {
  titulo: string;
  descricao: string;
  dataAbertura: Date;
  status: "aberta" | "em andamento" | "concluída";
  prioridade: "baixa" | "média" | "alta";
  responsavel?: string;
  setorSolicitante: string;
  prazoEstimado?: Date;
  valorServico: number;
}

const ServiceOrderSchema: Schema = new Schema(
  {
    titulo: {
      type: String,
      required: [true, "O título é obrigatório"],
      trim: true,
    },
    descricao: {
      type: String,
      required: [true, "A descrição é obrigatória"],
      trim: true,
    },
    dataAbertura: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      required: [true, "O status é obrigatório"],
      enum: {
        values: ["aberta", "em andamento", "concluída"],
        message: "Status deve ser: aberta, em andamento ou concluída",
      },
      default: "aberta",
    },
    prioridade: {
      type: String,
      required: [true, "A prioridade é obrigatória"],
      enum: {
        values: ["baixa", "média", "alta"],
        message: "Prioridade deve ser: baixa, média ou alta",
      },
    },
    responsavel: {
      type: String,
      trim: true,
    },
    setorSolicitante: {
      type: String,
      required: [true, "O setor solicitante é obrigatório"],
      trim: true,
    },
    prazoEstimado: {
      type: Date,
    },
    valorServico: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "O valor do serviço é obrigatório"],
      min: [0, "O valor do serviço deve ser maior ou igual a 0"],
      get: (v: mongoose.Types.Decimal128) => {
        return v ? parseFloat(v.toString()) : 0;
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

export default mongoose.model<IServiceOrder>(
  "ServiceOrder",
  ServiceOrderSchema
);
