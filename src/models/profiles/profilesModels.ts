import connection from "../Connection/connection";

export async function selectStoreByUser(user: string) {
  const pool = await connection.openConnection();

  try {
/*     const query = `SELECT LOGIN_USUARIO AS [user], PERFIL AS profile, CODIGO_LOJA AS storeCode, FILIAL AS branch, ATIVO AS status
    FROM ACESSO_PERFIL WHERE LOGIN_USUARIO = '${user}' AND ATIVO = 1`; */

    const query = `SELECT LOGIN_USUARIO AS [user], PERFIL AS profile, CODIGO_LOJA AS storeCode, FILIAL AS branch, ATIVO AS status, CODIGO_LOJA + ' - ' + FILIAL AS storeBranch
    FROM ACESSO_PERFIL WHERE LOGIN_USUARIO = '${user}' AND ATIVO = 1 ORDER BY CODIGO_LOJA;`;

    const result = await pool.request().query(query);

    return result.recordset;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Erro ao executar a consulta ${error.message}`);
    } else {
      console.log("Erro desconhecido ao executar a consulta");
    }
    throw error;
  } finally {
    await connection.closeConnection();
    console.log("Conexão fechada");
  }
}

export async function selectPathBeepInput() {
  const pool = await connection.openConnection();
  try {
    const query = `SELECT VALOR AS path FROM PARAMETROS_DGCS WHERE NOME_PARAMETRO = 'Acesso_Entrada_Bipada'`;

    const result = await pool.request().query(query);

    return result.recordset;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Erro ao executar a consulta ${error.message}`);
    } else {
      console.log("Erro desconhecido ao executar a consulta");
    }
    throw error;
  } finally {
    await connection.closeConnection();
    console.log("Conexão fechada");
  }
}
