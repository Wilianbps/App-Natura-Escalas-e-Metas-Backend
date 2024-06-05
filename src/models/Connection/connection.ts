import sql, { ConnectionPool } from "mssql";
import config from "../../configs/config";

async function openConnection(): Promise<ConnectionPool> {
  const pool = await sql.connect(config);
  return pool;
}

async function closeConnection(pool: ConnectionPool): Promise<void>{
  await pool.close();
}

export default {openConnection, closeConnection}
