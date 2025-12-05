import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, "../../logs/reservas.log");

// Garante que o diretório de logs existe
const ensureLogDir = () => {
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

export const log = (message: string) => {
  ensureLogDir();
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  // Escreve no arquivo
  fs.appendFileSync(logFilePath, logMessage);

  // Também exibe no console
  console.log(logMessage.trim());
};
