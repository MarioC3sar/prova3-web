"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ServiceOrderSchema = new mongoose_1.Schema({
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
        type: mongoose_1.default.Schema.Types.Decimal128,
        required: [true, "O valor do serviço é obrigatório"],
        min: [0, "O valor do serviço deve ser maior ou igual a 0"],
        get: (v) => {
            return v ? parseFloat(v.toString()) : 0;
        },
    },
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
exports.default = mongoose_1.default.model("ServiceOrder", ServiceOrderSchema);
