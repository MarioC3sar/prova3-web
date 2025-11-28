import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import serviceOrderRoutes from "./routes/serviceOrderRoutes";
import path from "path";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, "../public")));

// Rota de boas-vindas da API
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "🏢 API do Sistema de Ordens de Serviço",
    version: "1.0.0",
    endpoints: {
      "Criar ordem": "POST /api/service-orders",
      "Listar ordens": "GET /api/service-orders",
      "Buscar por título": "GET /api/service-orders/search?titulo=...",
      "Buscar por ID": "GET /api/service-orders/:id",
      "Atualizar ordem": "PUT /api/service-orders/:id",
      "Atualizar status": "PATCH /api/service-orders/:id/status",
      "Deletar ordem": "DELETE /api/service-orders/:id",
    },
    documentation: "Veja README.md para documentação completa",
  });
});

// Rotas da API
app.use("/api", serviceOrderRoutes);

// Rota principal para servir o frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Conectar ao banco e iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `🚀 Sistema de Ordens de Serviço rodando em http://localhost:${PORT}`
      );
      console.log(`📊 API disponível em http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
};

startServer();
