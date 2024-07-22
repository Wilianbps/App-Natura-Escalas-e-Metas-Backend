import { Request, Response } from "express";
import {
  SelectInputFlow,
  selectScaleByDate,
  selectScaleSummary,
  updateScale,
} from "../../models/scales/scalesModels";
import { transformedScale } from "../../models/scales/utils/transformedScale";
import { separateScaleByWeek } from "./utils/separateScaleByWeek";
import { removeDuplicateObject } from "./utils/removeDuplicateObject";

export async function findScaleByDate(req: Request, res: Response) {
  try {
    const { date } = req.query;

    if (!date) return res.status(400).send();

    const scale = await selectScaleByDate(date as string);

    const result = transformedScale(scale);

    res.status(200).json({ result });
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findScaleSummary(req: Request, res: Response) {
  try {
    const { month, year } = req.query;

    if (!month || !year) return res.status(400).send();

    const getScaleSummary = await selectScaleSummary(
      month.toString(),
      year.toString()
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

export async function findInputFlow(req: Request, res: Response) {
  try {
    const { date, codeStore } = req.query;

    if (!date || !codeStore) return res.status(400).end();

    const result = await SelectInputFlow(date as string, codeStore as string)

    res.status(200).json(result)
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}
