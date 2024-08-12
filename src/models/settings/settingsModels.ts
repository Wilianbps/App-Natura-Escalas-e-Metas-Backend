import connection from "../Connection/connection";
import { IEmployee, ISettings } from "./settings";

export async function execProcImportSellers() {
  const pool = await connection.openConnection();
  try {
    await pool.request().execute("SP_DGCS_IMPORTAR_VENDEDORES");

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

export async function findAllEmployees(storeCode: string) {
  const pool = await connection.openConnection();
  try {
    const query = `SELECT ID_VENDEDOR_LINX AS idSeler, ID_AUSENCIA_PROGRAMADA AS idDayOff, CODIGO_LOJA AS storeCode, LOGIN_USUARIO AS userLogin, NOME_VENDEDOR AS name, ATIVO AS status, CARGO AS office, ID_TURNOS AS idShift, TURNO AS shift, HR_INICIO AS startTime, HR_FIM AS finishTime, AUSENCIA_INI AS startVacation, AUSENCIA_FIM AS finishVacation, TIPO_AUSENCIA AS typeAbsence, FLUXO_LOJA AS flowScale FROM W_CONSULTA_COLABORADORES WHERE CODIGO_LOJA = '${storeCode}'`;
    const employees = await pool.request().query(query);
    return employees.recordset;
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

export async function updateSettings(settings: ISettings, storeCode: string) {
  const pool = await connection.openConnection();
  try {
    const results = { success: true, message: "" };

    await Promise.all(
      settings.employeeStatus.map(async (employee) => {
        try {
          await pool
            .request()
            .query(
              `UPDATE LOJA_VENDEDOR SET ATIVO = ${employee.status} WHERE ID_VENDEDOR_LINX = '${employee.idSeler}' AND CODIGO_lOJA = '${storeCode}'`
            );
        } catch (error) {
          results.success = false;
          if (error instanceof Error) {
            results.message = `Erro ao atualizar o status do funcionário '${employee.idSeler}': ${error.message}`;
          }
        }
      })
    );

    if (results.success) {
      const updateScaleFlow = `UPDATE PARAMETROS_DGCS SET VALOR = '${settings.flowScale}' WHERE NOME_PARAMETRO = 'FLUXO_MEDIO'`;
      await pool.request().query(updateScaleFlow);
    }

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

export async function updateEmployee(
  employee: IEmployee,
  storeCode: string
): Promise<{ success?: boolean; message?: string }> {
  const pool = await connection.openConnection();

  return new Promise(async (resolve, reject) => {
    try {
      //INÍCIO UPDATE DO TURNO

      const UpdateIdShift = `UPDATE LOJA_VENDEDOR SET ID_TURNOS = '${employee.idShift}' WHERE ID_VENDEDOR_LINX = '${employee.idSeler}' AND CODIGO_LOJA = '${storeCode}'`;

      await pool.request().query(UpdateIdShift);

      //FIM UPDATE DO TURNO

      //INÍCIO INSERT OU DELETE DAS FOLGAS

      const arrayDaysOff = employee.arrayDaysOff;

      for (let i = 0; i < arrayDaysOff.length; i++) {
        if (arrayDaysOff[i].type === "") continue;

        if (arrayDaysOff[i].type === "I") {
          const insertDayOff = `INSERT INTO AUSENCIA_PROGRAMADA (CODIGO_LOJA, LOGIN_USUARIO, ID_VENDEDOR_LINX, DATA_INICIO, DATA_FIM, TIPO_AUSENCIA) values ('${employee.storeCode}', '${employee.userLogin}', '${employee.idSeler}', '${arrayDaysOff[i].date}', '${arrayDaysOff[i].date}', 'FOLGA')`;
          await pool.request().query(insertDayOff);
        }

        if (arrayDaysOff[i].type === "D") {
          const deleteDayOff = `DELETE FROM AUSENCIA_PROGRAMADA WHERE ID = '${arrayDaysOff[i].id}' AND CODIGO_LOJA = '${storeCode}'`;
          await pool.request().query(deleteDayOff);
        }
      }

      //FIM INSERT OU DELETE DAS FOLGAS

      const arrayVacation = employee.arrayVacation;

      for (let i = 0; i < arrayVacation.length; i++) {
        if (arrayVacation[i].type === "") continue;

        if (arrayVacation[i].type === "I") {
          const insertVacation = `INSERT INTO AUSENCIA_PROGRAMADA (CODIGO_LOJA, LOGIN_USUARIO, ID_VENDEDOR_LINX, DATA_INICIO, DATA_FIM, TIPO_AUSENCIA) values ('${employee.storeCode}', '${employee.userLogin}', '${employee.idSeler}', '${arrayVacation[i].startVacation}', '${arrayVacation[i].finishVacation}', 'FERIAS')`;
          await pool.request().query(insertVacation);
        }

        if (arrayVacation[i].type === "D") {
          const deleteVacation = `DELETE FROM AUSENCIA_PROGRAMADA WHERE ID = '${arrayVacation[i].id}' AND CODIGO_lOJA = '${storeCode}'`;
          await pool.request().query(deleteVacation);
        }
      }

      //INÍCIO INSERT OU DELETE DAS FÉRIAS

      //FIM INSERT OU DELETE DAS FÉRIAS

      return resolve({
        success: true,
        message: "Alterações feitas com sucesso.",
      });
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
  });
}
