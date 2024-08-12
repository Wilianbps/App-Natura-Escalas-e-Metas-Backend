import { Request, Response } from "express";
import {
  findAllEmployees,
  updateEmployee,
  updateSettings,
} from "../../models/settings/settingsModels";
import { IEmployee } from "src/models/settings/settings";
import { removeDuplicateObject } from "./libs/removeDuplicateObject";
import { addDayOffInArray } from "./libs/addDayOffInArray";
import { addVacationInArray } from "./libs/addVacationInArray";
import { filterDayOffAndVacation } from "./libs/filterDayOffAndVacation";

export async function getAllEmployees(req: Request, res: Response) {
  try {
    const { storeCode } = req.query;

    console.log("storeCode employyes", storeCode);

    if (!storeCode) return res.status(404).send();

    const employees: IEmployee[] = await findAllEmployees(storeCode as string);

    employees.map((employee) => (employee.idSeler === 1 ? true : false));

    addDayOffInArray(employees);

    addVacationInArray(employees);

    const employeesWithOutDuplicateObjects = removeDuplicateObject(employees);

    const filterArray = filterDayOffAndVacation(
      employeesWithOutDuplicateObjects
    );

    return res.status(200).json(filterArray);
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

    console.log("opa wil, chegou aqui tbm no upadateSettings", storeCode)

    if (data.storeCode === "" || data.userLogin === "" || !storeCode)
      return res
        .status(400)
        .json({ message: "Usuário ou código da loja não identificado" });

    const update = await updateEmployee(data, storeCode as string);

    if (update.success) {
      return res.status(200).json({ message: update.message });
    } else {
      return res.status(400).json({ message: update.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro" });
  }
}
