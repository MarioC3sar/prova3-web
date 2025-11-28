import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  titulo: string;
  descricao?: string;
  data: Date;
  local: string;
  valor: number;
}

const EventSchema: Schema = new Schema(
  {
    titulo: {
      type: String,
      required: [true, "O título é obrigatório"],
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
    data: {
      type: Date,
      required: [true, "A data é obrigatória"],
    },
    local: {
      type: String,
      required: [true, "O local é obrigatório"],
      trim: true,
    },
    valor: {
      type: Number,
      required: [true, "O valor é obrigatório"],
      min: [0, "O valor deve ser maior ou igual a 0"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvent>("Event", EventSchema);
