import connection from "../Connection/connection";
import { IScale, IScaleApproval } from "./scales";

export async function selectScaleByDate(date: string, storeCode: string) {
  const pool = await connection.openConnection();

  try {
    const query = `SELECT 
    DATA_ESCALA AS date, 
    ID_VENDEDOR_LINX AS id, 
    NOME_VENDEDOR AS name, 
    ID_TURNO AS idTurn, 
    STATUS AS status, 
    ACTIVE_DAYS as activeDays, 
    HR_ID14, HR_ID15, HR_ID16, HR_ID17, HR_ID18, HR_ID19, HR_ID20, HR_ID21, HR_ID22, HR_ID23, HR_ID24, HR_ID25, HR_ID26,
    HR_ID27, HR_ID28, HR_ID29, HR_ID30, HR_ID31, HR_ID32, HR_ID33, HR_ID34, HR_ID35, HR_ID36, HR_ID37, HR_ID38, HR_ID39, HR_ID40, HR_ID41, HR_ID42, HR_ID43 
FROM 
    W_DGCS_CONSULTA_ESCALAS 
WHERE 
    CAST(DATA_ESCALA AS DATE) = '${date}' AND CODIGO_LOJA = '${storeCode}'
ORDER BY 
    CASE 
        WHEN STATUS = 0 THEN 1  -- Coloca STATUS 0 por último
        ELSE 0  -- Todos os outros casos
    END,
    DATA_ESCALA, 
    CASE 
        WHEN STATUS = 1 THEN ID_TURNO  -- Ordena por ID_TURNO se STATUS for 1
        ELSE 999  -- Garante que outros casos fiquem depois de STATUS 1
    END;`;

    const scale = await pool.request().query(query);

    return scale.recordset;
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

export async function selectScaleSummary(month: string, year: string, storeCode: string) {
  const pool = await connection.openConnection();

  try {
    const query = `SELECT ID_VENDEDOR_LINX AS id, NOME_VENDEDOR AS name, DATA_ESCALA AS date, DAY(DATA_ESCALA) AS day, MONTH(DATA_ESCALA) AS month, YEAR(DATA_ESCALA) AS year, ID_TURNO AS turnId, STATUS AS status, HR_INICIO AS startTime, HR_FIM AS endTime FROM W_DGCS_CONSULTA_ESCALAS_RESUMO WHERE MONTH(DATA_ESCALA) = '${month}' AND YEAR(DATA_ESCALA) = '${year}' AND CODIGO_LOJA = '${storeCode}' ORDER BY DATA_ESCALA, ID_TURNO`;

    const scaleSummary = await pool.request().query(query);

    return scaleSummary.recordset;
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

export async function updateScale(scales: IScale[]) {
  const pool = await connection.openConnection();

  try {
    const results = { success: true, message: "" };

    await Promise.all(
      scales.map(async (scale) => {
        scale.options.forEach((item) => {
          if (item.type === "null") {
            item.type = "";
          }
        });

        try {
          const update = `UPDATE ESCALA SET ID_TURNO = ${scale.turn}, STATUS = ${scale.status}, HR_ID14 = '${scale.options[0].type}', 
          HR_ID15 = '${scale.options[1].type}', HR_ID16  = '${scale.options[2].type}', HR_ID17 = '${scale.options[3].type}', HR_ID18 = '${scale.options[4].type}', 
          HR_ID19 = '${scale.options[5].type}', HR_ID20 = '${scale.options[6].type}', HR_ID21 = '${scale.options[7].type}', HR_ID22 = '${scale.options[8].type}', 
          HR_ID23 = '${scale.options[9].type}', HR_ID24 = '${scale.options[10].type}', HR_ID25 = '${scale.options[11].type}', HR_ID26 = '${scale.options[12].type}', 
          HR_ID27 = '${scale.options[13].type}', HR_ID28 = '${scale.options[14].type}', HR_ID29 = '${scale.options[15].type}', HR_ID30 = '${scale.options[16].type}', 
          HR_ID31 = '${scale.options[17].type}', HR_ID32 = '${scale.options[18].type}', HR_ID33 = '${scale.options[19].type}', HR_ID34 = '${scale.options[20].type}', 
          HR_ID35 = '${scale.options[21].type}', HR_ID36 = '${scale.options[22].type}', HR_ID37 = '${scale.options[23].type}', HR_ID38 = '${scale.options[24].type}', 
          HR_ID39 = '${scale.options[25].type}', HR_ID40 = '${scale.options[26].type}', HR_ID41 = '${scale.options[27].type}', HR_ID42 = '${scale.options[28].type}', 
          HR_ID43 = '${scale.options[29].type}' WHERE ID_VENDEDOR_LINX = ${scale.id} AND CAST(DATA_ESCALA AS DATE) = '${scale.date}'`;
          await pool.request().query(update);
        } catch (error) {
          if (error instanceof Error) {
            results.success = false;
            results.message = `Erro ao atualizar a escala.'${scale.id}'`;
            console.log(error.message);
          }
        }
      })
    );

    return results;
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

export async function SelectInputFlow(date: string, codeStore: string) {
  const pool = await connection.openConnection();

  try {
    const query = `SELECT [HR_ID14] ,[HR_ID15] ,[HR_ID16], [HR_ID17], [HR_ID18] ,[HR_ID19] ,[HR_ID20] ,[HR_ID21] ,[HR_ID22] ,[HR_ID23]
      ,[HR_ID24], [HR_ID25], [HR_ID26] ,[HR_ID27] ,[HR_ID28] ,[HR_ID29] ,[HR_ID30] ,[HR_ID31] ,[HR_ID32] ,[HR_ID33] ,[HR_ID34],[HR_ID35]
      ,[HR_ID36] ,[HR_ID37] ,[HR_ID38] ,[HR_ID39] ,[HR_ID40] ,[HR_ID41] ,[HR_ID42],[HR_ID43] FROM W_DGCS_FLUXO_ENTRADA_DATA 
      WHERE DATA = '${date}' AND CODIGO_LOJA = '${codeStore}'`;

    const inputFlow = (await pool.request().query(query)).recordset;

    inputFlow.forEach((obj) => {
      for (let key in obj) {
        if (obj[key] === null) {
          obj[key] = 0;
        }
      }
    });

    return inputFlow;
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

export async function executeProcToLoadMonthScale(
  storeCode: string,
  loginUser: string,
  date: string,
  currentDate: string,
  finished: number
) {
  const pool = await connection.openConnection();

  try {
    const query = `SP_DGCS_PREENCHER_ESCALA '${date}', '${loginUser}'`;

    await pool.request().query(query);

    const insertQuery = `
        INSERT INTO ESCALA_FINALIZADA (CODIGO_LOJA, LOGIN_USUARIO, DATA_ESCALA_INICIO, FINALIZADA)
        VALUES ('${storeCode}', '${loginUser}', '${currentDate}', ${finished})
      `;

    await pool.request().query(insertQuery);
    console.log("Dados inseridos com sucesso");

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Erro ao executar a consulta: ${error.message}`);
    } else {
      console.log("Erro desconhecido ao executar a consulta");
    }
    throw error;
  } finally {
    await connection.closeConnection();
    console.log("Conexão fechada");
  }
}

export async function SelectFinishedScaleByMonth(month: number, year: number) {
  const pool = await connection.openConnection();

  try {
    const query = `SELECT CODIGO_LOJA AS storeCode, LOGIN_USUARIO AS loginUser, DATA_ESCALA_INICIO AS startDate, 
    DATA_ESCALA_FIM AS endDate, FINALIZADA AS finished FROM ESCALA_FINALIZADA 
    WHERE DATEPART(MONTH, DATA_ESCALA_INICIO) = ${month} AND DATEPART(YEAR, DATA_ESCALA_INICIO) = ${year};`;

    const result = (await pool.request().query(query)).recordset;

    return result;
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

export async function updateFinishedScale(
  storeCode: string,
  month: number,
  year: number,
  endScaleDate: string
) {
  const pool = await connection.openConnection();

  try {
    const query = `UPDATE ESCALA_FINALIZADA SET DATA_ESCALA_FIM = '${endScaleDate}', FINALIZADA = 1 WHERE CODIGO_LOJA = '${storeCode}' AND DATEPART(MONTH, DATA_ESCALA_INICIO) = ${month}
  AND DATEPART(YEAR, DATA_ESCALA_INICIO) = ${year};`;

    await pool.request().query(query);

    return true;
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

export async function insertInTableScaleApproval(data: IScaleApproval) {
  const pool = await connection.openConnection();

  try {
    const insert = `INSERT INTO APROVACAO_ESCALA (DESCRICAO, RESPONSAVEL, CODIGO_LOJA, FILIAL, DATA_SOLICITACAO, [STATUS]) VALUES ('${data.description}', '${data.responsible}', '${data.storeCode}', '${data.branch}', '${data.requestDate}', ${data.status})`;

    await pool.request().query(insert);

    return true;
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

export async function selectScaleApprovalRequest(month: number, year: number) {
  const pool = await connection.openConnection();

  try {
/*     const query = `SELECT TOP 1 DESCRICAO AS description, RESPONSAVEL AS responsible, FILIAL AS branch, 
    DATA_SOLICITACAO AS requestDate, DATA_APROVACAO AS approvalDate, STATUS AS status FROM APROVACAO_ESCALA 
    WHERE DATEPART(MONTH, DATA_SOLICITACAO) = ${month} AND DATEPART(YEAR, DATA_SOLICITACAO) = ${year}`; */

    const query = `SELECT ID AS id, DESCRICAO AS description, RESPONSAVEL AS responsible, FILIAL AS branch, 
    DATA_SOLICITACAO AS requestDate, DATA_APROVACAO AS approvalDate, STATUS AS status FROM APROVACAO_ESCALA 
    WHERE DATEPART(MONTH, DATA_SOLICITACAO) = ${month} AND DATEPART(YEAR, DATA_SOLICITACAO) = ${year}`;

    const result = (await pool.request().query(query)).recordset;

    return result;
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

export async function updateScaleApprovalRequest(
  id: string,
  month: number,
  year: number,
  storeCode: string,
  approvalDate: string,
  status: number
) {
  const pool = await connection.openConnection();

  try {
    const update = `UPDATE APROVACAO_ESCALA SET DATA_APROVACAO = '${approvalDate}', STATUS = ${status} WHERE ID = '${id}' AND CODIGO_LOJA = '${storeCode}' AND DATEPART(MONTH, DATA_SOLICITACAO) = ${month}
  AND DATEPART(YEAR, DATA_SOLICITACAO) = ${year};`;

    await pool.request().query(update);

    return true;
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
