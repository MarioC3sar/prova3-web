"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const serviceOrderRoutes_1 = __importDefault(require("./routes/serviceOrderRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir arquivos estáticos (frontend)
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Rotas da API
app.use("/api", serviceOrderRoutes_1.default);
// Rota principal para servir o frontend
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/index.html"));
});
// Conectar ao banco e iniciar servidor
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        app.listen(PORT, () => {
            console.log(`🚀 Sistema de Ordens de Serviço rodando em http://localhost:${PORT}`);
            console.log(`📊 API disponível em http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        console.error("❌ Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
};
startServer();
