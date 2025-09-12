import { Request, Response } from "express";
import {
  executeProcToLoadMonthScale,
  getScaleByMonthDate,
  insertInTableScaleApproval,
  SelectFinishedScaleByMonth,
  SelectInputFlow,
  selectParamGenerateScaleNextMonth,
  selectParamToAlterDayScale,
  selectScaleApprovalRequest,
  selectScaleByDate,
  selectScaleSummary,
  selectStoresScaleStatus,
  updateFinishedScale,
  updateScale,
  updateScaleApprovalRequest,
  updateScaleByMonth,
} from "../../models/scales/scalesModels";
import { transformedScale } from "../../models/scales/utils/transformedScale";
import { separateScaleByWeek } from "./utils/separateScaleByWeek";
import { removeDuplicateObject } from "./utils/removeDuplicateObject";
import { IScaleApproval } from "src/models/scales/scales";
import { splitsArrayIntoTwoParts } from "./utils/splitsArrayIntoTwoParts";
import { removeDuplicateObjectOfScaleByFortnight } from "./utils/removeDuplicateObjectOfScaleByFortnight";
import { getMonthlyScheduleGroupedByDayAndCollaborator } from "./utils/getMonthlyScheduleGroupedByDayAndCollaborator";

export async function findScaleByDate(req: Request, res: Response) {
  try {
    const { date, storeCode } = req.query;

    if (!date || !storeCode) return res.status(400).send();

    const scale = await selectScaleByDate(date as string, storeCode as string);

    const result = transformedScale(scale);

    res.status(200).json({ result });
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findScaleSummary(req: Request, res: Response) {
  try {
    const { month, year, storeCode } = req.query;

    if (!month || !year || !storeCode) return res.status(400).send();

    const getScaleSummary = await selectScaleSummary(
      month as string,
      year as string,
      storeCode as string
    );

    const scaleSummaryByWeek = separateScaleByWeek(
      getScaleSummary,
      Number(month),
      Number(year)
    );

    const data = removeDuplicateObject(scaleSummaryByWeek as []);

    res.status(200).json(data);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findScaleSummarysByFortnight(
  req: Request,
  res: Response
) {
  try {
    const { month, year, storeCode } = req.query;

    if (!month || !year || !storeCode) return res.status(400).send();

    const getScaleSummary = await selectScaleSummary(
      month as string,
      year as string,
      storeCode as string
    );
    const splitArray = splitsArrayIntoTwoParts(getScaleSummary);

    const data = removeDuplicateObjectOfScaleByFortnight(splitArray as []);

    res.status(200).json(data);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findScaleByMonthDate(req: Request, res: Response) {
  try {
    const { month, year, storeCode } = req.query;

    if (!month || !year || !storeCode) return res.status(400).send();

    const scale = await getScaleByMonthDate(
      month as string,
      year as string,
      storeCode as string
    );

    const result = getMonthlyScheduleGroupedByDayAndCollaborator(scale);

    res.status(200).json(result);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function updateScaleByDate(req: Request, res: Response) {
  try {
    const { data } = req.body;

    const result = updateScale(data);

    if ((await result).success) {
      res.status(200).json({ message: "Alteração feita com sucesso." });
    } else {
      res.status(500).json({ message: (await result).message });
    }
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function updateScaleByMonthDate(req: Request, res: Response) {
  try {
    const { scales } = req.body;
    const { storeCode, loginUser } = req.query;

    if (!scales || !storeCode || !loginUser) {
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    await updateScaleByMonth(scales, storeCode as string, loginUser as string);

    res.status(200).json({ message: "Alteração feita com sucesso." });
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findInputFlow(req: Request, res: Response) {
  try {
    const { date, codeStore } = req.query;

    if (!date || !codeStore) return res.status(400).end();

    const result = await SelectInputFlow(date as string, codeStore as string);

    res.status(200).json(result);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function loadMonthScale(req: Request, res: Response) {
  try {
    const { storeCode, loginUser, date, currentDate, finished } = req.query;

    if (!storeCode || !loginUser || !date || !finished)
      return res.status(400).send();

    const success = await executeProcToLoadMonthScale(
      storeCode as string,
      loginUser as string,
      date as string,
      currentDate as string,
      Number(finished)
    );

    if (success) {
      res.status(200).send();
    } else {
      res.status(400).json({ message: "Não foi possível carregar a escala" });
    }
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findFinishedScaleByMonth(req: Request, res: Response) {
  try {
    const { month, year, storeCode } = req.query;

    if (!month || !year || !storeCode) return res.status(400).send();

    const result = await SelectFinishedScaleByMonth(
      Number(month),
      Number(year),
      String(storeCode)
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function updateFinishedScaleByMonth(req: Request, res: Response) {
  try {
    const { userLogin, storeCode, month, year, endScaleDate } = req.query;

    if (!userLogin || !storeCode || !month || !year || !endScaleDate)
      return res.status(400).send();

    const success = await updateFinishedScale(
      String(userLogin),
      String(storeCode),
      Number(month),
      Number(year),
      String(endScaleDate)
    );

    if (success) {
      res.status(200).send();
    } else {
      res.status(400).json({
        message: "Não foi possível atualizar a escala como finalizada",
      });
    }
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function postScaleApprovalRequest(req: Request, res: Response) {
  try {
    const data: IScaleApproval = req.body;

    if (!data) return res.status(400).send();

    const success = await insertInTableScaleApproval(data);

    if (success) {
      res.status(200).send();
    } else {
      res.status(400).json({
        message: "Não foi possível inserir na tabela",
      });
    }
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findScaleApprovalRequest(req: Request, res: Response) {
  try {
    const { userLogin, profileLogin, month, year } = req.query;

    if (!userLogin || !profileLogin || !month || !year)
      return res.status(400).send();

    const result = await selectScaleApprovalRequest(
      String(userLogin),
      String(profileLogin),
      Number(month),
      Number(year)
    );

    if (result === undefined) {
      return res.status(400).send();
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function putScaleApprovalRequest(req: Request, res: Response) {
  try {
    const { id, month, year, storeCode, approvalDate, status } = req.query;

    if (!id || !month || !year || !storeCode || !approvalDate || !status)
      return res.status(400).send();

    const success = await updateScaleApprovalRequest(
      id as string,
      Number(month),
      Number(year),
      storeCode as string,
      approvalDate as string,
      Number(status)
    );

    if (success) {
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function getParamGenerateScaleNextMonth(
  _req: Request,
  res: Response
) {
  try {
    const param = await selectParamGenerateScaleNextMonth();

    return res.status(200).json(param);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function getParamToAlterDayScale(_req: Request, res: Response) {
  try {
    const param = await selectParamToAlterDayScale();

    return res.status(200).json(param);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findStoresScaleStatus(req: Request, res: Response) {
  try {
    const { currentDate } = req.query;

    const stores = await selectStoresScaleStatus(String(currentDate));

    return res.status(200).json(stores);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}
