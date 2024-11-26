import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import connection from "../Connection/connection";
import sql from "mssql";

export async function selectGoalsByDateOrderById(
  storeCode: string,
  month: string,
  year: string,
  goalType: string
) {
  try {
    const pool = await connection.openConnection();

    let goalField;
    switch (goalType) {
      case "goal":
        goalField = "ESCALAS_METAS_META";
        break;
      case "super-goal":
        goalField = "ESCALAS_METAS_SUPER";
        break;
      case "hiper-goal":
        goalField = "ESCALAS_METAS_HIPER";
        break;
      default:
        throw new Error(`Tipo de meta inválido: ${goalType}`);
    }

    const query = `SELECT ID_VENDEDOR_LINX AS id, CODIGO_LOJA AS codeStore, NOME_VENDEDOR AS name, VENDEDOR_EXTRA AS activeSeller, DATA AS date, META_DIA_LOJA AS goalDay, ${goalField} AS goalDayByEmployee FROM W_DGCS_METAS_VENDEDORES_ATIVOS WHERE CODIGO_LOJA = '${storeCode}' AND MONTH(DATA) = '${month}' AND YEAR(DATA) = '${year}' ORDER BY ID_VENDEDOR_LINX`;

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
    console.log("Conexão fechada");
  }
}

export async function selectGoalsByDate(
  storeCode: string,
  month: string,
  year: string
) {
  const pool = await connection.openConnection();

  try {
    const query = `SELECT ID_VENDEDOR_LINX AS id, CODIGO_LOJA AS codeStore, NOME_VENDEDOR AS name, DATA AS date, META_DIA_LOJA AS goalDay, META_DIARIA_POR_VENDEDOR AS goalDayByEmployee FROM W_DGCS_METAS_VENDEDORES_ATIVOS WHERE CODIGO_LOJA = '${storeCode}' AND MONTH(DATA) = '${month}' AND YEAR(DATA) = '${year}'`;

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
    await connection.closeConnection();
    console.log("Conexão fechada");
  }
}

export async function selectGoalsByWeek(
  storeCode: string,
  initialDate: string,
  lastDate: string
) {
  const pool = await connection.openConnection();

  try {
    const query = `SELECT SUM(META_VALOR) AS goalValue, META_TIPO AS goalType FROM W_DGCS_CONSULTA_METAS 
                  WHERE CODIGO_LOJA = '${storeCode}' AND DATA BETWEEN '${initialDate}' AND '${lastDate}'
                  GROUP BY META_TIPO`;

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
    await connection.closeConnection();
    console.log("Conexão fechada");
  }
}

export async function selectGoalsEmployeesByMonth(
  storeCode: string,
  month: string,
  year: string
) {
  const pool = await connection.openConnection();

  try {
    const query = `SELECT ID_VENDEDOR_LINX AS id, NOME_VENDEDOR AS name, META_DIARIA_POR_VENDEDOR AS goalDayByEmployee FROM W_DGCS_METAS_VENDEDORES_ATIVOS WHERE CODIGO_LOJA = '${storeCode}' AND MONTH(DATA) = '${month}' AND YEAR(DATA) = '${year}'`;

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
    await connection.closeConnection();
    console.log("Conexão fechada");
  }
}

export async function selectRankingGoalsLastTwelveMonths(
  storeCode: string,
  lastDate: string
) {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const pool = await connection.openConnection();

  try {
    const endDate = new Date(
      parseInt(lastDate.slice(0, 4)),
      parseInt(lastDate.slice(4, 6)) - 1,
      parseInt(lastDate.slice(6, 8))
    );

    const results = await Promise.all(
      Array.from({ length: 12 }, (_, i) => {
        const startDateCalc = subMonths(endDate, i);
        const startDateFormatted = format(
          startOfMonth(startDateCalc),
          "yyyy-MM-dd"
        );
        const endDateFormatted = format(
          endOfMonth(startDateCalc),
          "yyyy-MM-dd"
        );
        const monthIndex = startDateCalc.getMonth();
        const year = startDateCalc.getFullYear();

        const query = `
          SELECT SUM(META_VALOR) AS goalValue, META_TIPO AS goalType
          FROM W_DGCS_CONSULTA_METAS
          WHERE CODIGO_LOJA = @storeCode AND DATA BETWEEN @startDate AND @endDate
          GROUP BY META_TIPO
        `;

        const request = pool.request();
        request.input("storeCode", sql.VarChar, storeCode);
        request.input("startDate", sql.Date, startDateFormatted);
        request.input("endDate", sql.Date, endDateFormatted);

        return request.query(query).then((result) => {
          const monthData = {
            name: `${months[monthIndex]}-${year}`,
            hiperMeta: 0,
            superMeta: 0,
            meta: 0,
          };

          result.recordset.forEach((record) => {
            if (record.goalType === "HIPER_META")
              monthData.hiperMeta = record.goalValue;
            if (record.goalType === "SUPER_META")
              monthData.superMeta = record.goalValue;
            if (record.goalType === "META") monthData.meta = record.goalValue;
          });

          return monthData;
        });
      })
    );

    return results.reverse();
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
