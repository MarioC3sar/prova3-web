import mongoose from "mongoose";
import dotenv from "dotenv";
import Mesa from "./models/Mesa";

dotenv.config();

const mesas = [
  // Salão - 10 mesas
  { numero: 1, capacidade: 2, localizacao: "salão" },
  { numero: 2, capacidade: 2, localizacao: "salão" },
  { numero: 3, capacidade: 4, localizacao: "salão" },
  { numero: 4, capacidade: 4, localizacao: "salão" },
  { numero: 5, capacidade: 4, localizacao: "salão" },
  { numero: 6, capacidade: 6, localizacao: "salão" },
  { numero: 7, capacidade: 6, localizacao: "salão" },
  { numero: 8, capacidade: 8, localizacao: "salão" },
  { numero: 9, capacidade: 4, localizacao: "salão" },
  { numero: 10, capacidade: 2, localizacao: "salão" },

  // Varanda - 6 mesas
  { numero: 11, capacidade: 2, localizacao: "varanda" },
  { numero: 12, capacidade: 2, localizacao: "varanda" },
  { numero: 13, capacidade: 4, localizacao: "varanda" },
  { numero: 14, capacidade: 4, localizacao: "varanda" },
  { numero: 15, capacidade: 6, localizacao: "varanda" },
  { numero: 16, capacidade: 4, localizacao: "varanda" },

  // Área Interna - 4 mesas
  { numero: 17, capacidade: 2, localizacao: "área interna" },
  { numero: 18, capacidade: 4, localizacao: "área interna" },
  { numero: 19, capacidade: 6, localizacao: "área interna" },
  { numero: 20, capacidade: 8, localizacao: "área interna" },
];

async function seedDatabase() {
  try {
    // Conectar ao banco de dados
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/reserva"
    );
    console.log("✅ Conectado ao MongoDB");

    // Limpar mesas existentes
    await Mesa.deleteMany({});
    console.log("🗑️  Mesas anteriores removidas");

    // Inserir novas mesas
    await Mesa.insertMany(mesas);
    console.log(`✅ ${mesas.length} mesas inseridas com sucesso!`);

    console.log("\n📊 Resumo das mesas:");
    console.log(`   Salão: 10 mesas`);
    console.log(`   Varanda: 6 mesas`);
    console.log(`   Área Interna: 4 mesas`);
    console.log(`   Total: 20 mesas`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao popular banco de dados:", error);
    process.exit(1);
  }
}

seedDatabase();
