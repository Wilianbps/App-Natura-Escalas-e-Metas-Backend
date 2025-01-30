import sql from "mssql";
import config from "../../configs/config";

let pool: sql.ConnectionPool | null = null;

export async function openConnection(): Promise<sql.ConnectionPool> {
  try {
    // Verificar se o pool existe e está conectado
    if (pool && pool.connected) {
      console.log("Conexão já está aberta");
      return pool;
    }

    // Se o pool estiver presente mas não conectado, feche-o antes de criar um novo
    if (pool) {
      console.log("Fechando conexão existente");
      await closeConnection();
    }
    pool = await sql.connect(config);
    console.log("Conexão aberta");
    return pool;
  } catch (error) {
    console.error("Erro ao estabelecer conexão:", error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  if (pool) {
    try {
      await pool.close();
      pool = null;
    } catch (error) {
      console.error("Erro ao fechar conexão:", error);
      throw error;
    }
  }
}

export default { openConnection, closeConnection };
