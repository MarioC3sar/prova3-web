import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database";
import mesaRoutes from "./routes/mesaRoutes";
import reservaRoutes from "./routes/reservaRoutes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Rotas da API
app.use("/api/mesas", mesaRoutes);
app.use("/api/reservas", reservaRoutes);

// Rota principal - serve o frontend
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Rota para health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Servidor está funcionando" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
});

export default app;
