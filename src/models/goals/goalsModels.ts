import connection from "../Connection/connection";

export async function selectGoalsByDateOrderById(month: string, year: string) {
  const pool = await connection.openConnection();

  try {
    const query = `SELECT ID_VENDEDOR_LINX AS id, CODIGO_LOJA AS codeStore, NOME_VENDEDOR AS name, DATA AS date, META_DIA_LOJA AS goalDay, META_DIARIA_POR_VENDEDOR AS goalDayByEmployee FROM W_DGCS_METAS_VENDEDORES_ATIVOS WHERE MONTH(DATA) = '${month}' AND YEAR(DATA) = '${year}' ORDER BY ID_VENDEDOR_LINX`;

    const goals = await pool.request().query(query);

    return goals.recordset;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Erro ao executar a consulta ${error.message}`);
    } else {
      console.log("Erro desconhecido ao executar a consulta");
    }
    throw error;
  } finally {
    await connection.closeConnection(pool);
    console.log("Conexão fechada");
  }
}

export async function selectGoalsByDate(month: string, year: string) {
  const pool = await connection.openConnection();

  try {
    const query = `SELECT ID_VENDEDOR_LINX AS id, CODIGO_LOJA AS codeStore, NOME_VENDEDOR AS name, DATA AS date, META_DIA_LOJA AS goalDay, META_DIARIA_POR_VENDEDOR AS goalDayByEmployee FROM W_DGCS_METAS_VENDEDORES_ATIVOS WHERE MONTH(DATA) = '${month}' AND YEAR(DATA) = '${year}'`;

    const goals = await pool.request().query(query);

    return goals.recordset;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Erro ao executar a consulta ${error.message}`);
    } else {
      console.log("Erro desconhecido ao executar a consulta");
    }
    throw error;
  } finally {
    await connection.closeConnection(pool);
    console.log("Conexão fechada");
  }
}
