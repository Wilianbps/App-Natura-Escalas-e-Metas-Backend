import { Request, Response } from "express";
import {
  deleteEmployee,
  execProcImportSellers,
  findAllEmployees,
  insertEmployee,
  updateSettingsEmployee,
  updateEmployee,
  updateSettings,
  findShiftHours,
  updateShifitsByStore,
} from "../../models/settings/settingsModels";
import {
  IEmployee,
  type IInfoAddEmployee,
  type IInfoUpdateEmployee,
} from "src/models/settings/settings";
import { removeDuplicateObject } from "./libs/removeDuplicateObject";
import { addDayOffInArray } from "./libs/addDayOffInArray";
import { addVacationInArray } from "./libs/addVacationInArray";
import { filterDayOffAndVacation } from "./libs/filterDayOffAndVacation";

interface IShift {
  id?: number;
  turn: string;
  startTime: string;
  endTime: string;
}

interface IShifts {
  morning?: IShift;
  afternoon?: IShift;
  nocturnal?: IShift;
}

export async function transformEmployees(
  employees: IEmployee[]
): Promise<IEmployee[]> {
  employees.map((employee) => (employee.idSeler === 1 ? true : false));

  addDayOffInArray(employees);
  addVacationInArray(employees);

  const employeesWithOutDuplicateObjects = removeDuplicateObject(employees);

  const filterArray = filterDayOffAndVacation(employeesWithOutDuplicateObjects);

  return filterArray;
}

export async function getAllEmployees(req: Request, res: Response) {
  try {
    const { storeCode } = req.query;

    if (!storeCode) return res.status(404).send();

    const success = await execProcImportSellers();

    if (success) {
      const employees: IEmployee[] = await findAllEmployees(
        storeCode as string
      );

      const transformedEmployees = await transformEmployees(employees);

      return res.status(200).json(transformedEmployees);
    } else {
      return res.status(400).send();
    }
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(400).end();
  }
}

export async function updateStatusAndScaleFlowSettings(
  req: Request,
  res: Response
) {
  try {
    const data = req.body;
    const { storeCode } = req.query;

    if (!data || !storeCode) return res.status(400).end();

    const settings = await updateSettings(data, storeCode as string);

    if (settings.success) {
      res.status(200).json({ message: "Alteração feita com sucesso." });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateShiftRestSchedule(req: Request, res: Response) {
  try {
    const data: IEmployee = req.body;
    const { storeCode } = req.query;

    if (data.storeCode === "" || data.userLogin === "" || !storeCode)
      return res
        .status(400)
        .json({ message: "Usuário ou código da loja não identificado" });

    const result = await updateSettingsEmployee(data, storeCode as string);

    if (result.success) {
      const employees = await findAllEmployees(storeCode as string);
      const transformedEmployees = await transformEmployees(employees);
      return res
        .status(200)
        .json({ message: result.message, employees: transformedEmployees });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro" });
  }
}

export async function addEmployee(req: Request, res: Response) {
  try {
    const employee: IInfoAddEmployee = req.body;

    await insertEmployee(employee);

    return res.status(200).json({ message: "Usuário cadastrado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro" });
  }
}

export async function removeEmployeeById(req: Request, res: Response) {
  const { id: employeeId } = req.params; // Obtém o ID do funcionário do parâmetro da URL

  // Converte o id para número
  const employeeIdNumber = Number(employeeId);

  if (isNaN(employeeIdNumber)) {
    return res
      .status(400)
      .json({ message: "ID inválido. Deve ser um número." });
  }

  try {
    // Tenta encontrar e excluir o funcionário
    const employeeToDelete = await deleteEmployee(employeeIdNumber);

    if (!employeeToDelete) {
      return res.status(404).json({ message: "Colaborador não encontrado" });
    }

    // Resposta de sucesso
    return res
      .status(200)
      .json({ message: "Colaborador excluído com sucesso" });
  } catch (err) {
    // Caso haja erro, retorna uma mensagem
    return res
      .status(500)
      .json({ message: "Erro ao excluir funcionário", error: err });
  }
}

export async function updateEmployeeById(req: Request, res: Response) {
  try {
    const { id: employeeId } = req.params;
    const dataEmployee: IInfoUpdateEmployee = req.body;

    const employeeIdNumber = Number(employeeId);

    if (!employeeIdNumber || !dataEmployee.storeCode)
      return res
        .status(400)
        .json({ message: "Id do usuário ou código da loja não identificado" });

    const result = await updateEmployee(employeeIdNumber, dataEmployee);

    if (result) {
      const employees = await findAllEmployees(
        dataEmployee.storeCode as string
      );
      const transformedEmployees = await transformEmployees(employees);
      return res.status(200).json({
        message: "Alteração feita com sucesso",
        employees: transformedEmployees,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Erro ao fazer alteração do colaborador" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Erro no servidor", error: err });
  }
}

export async function getShiftHours(req: Request, res: Response) {
  try {
    const { storeCode } = req.query;

    if (!storeCode) return res.status(400).send();

    const result: IShift[] = await findShiftHours(String(storeCode));

    const shifts: IShifts = {};

    result.map((shift) => {
      if (shift) {
        if (shift.turn === "Matutino") shifts.morning = shift;
        if (shift.turn === "Vespertino") shifts.afternoon = shift;
        if (shift.turn === "Noturno") shifts.nocturnal = shift;
      }
    });

    return res.status(200).json(shifts);
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor", error });
  }
}

export async function updateShiftHours(req: Request, res: Response) {
  try {
    const { shifts, storeCode } = req.body;

    if (!storeCode) return res.status(400).send();

    await updateShifitsByStore(shifts as IShifts, String(storeCode));

    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor", error });
  }
}
