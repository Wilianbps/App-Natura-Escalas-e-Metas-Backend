import { Request, Response } from "express";
import {
  selectScaleByDate,
  selectScaleSummary,
  updateScale,
} from "../../models/scales/scalesModels";
import { transformedScale } from "../../models/scales/utils/transformedScale";

export async function findScaleByDate(req: Request, res: Response) {
  try {
    const { date } = req.query;

    if (!date) return res.status(404).send();

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
    const scaleSummary = await selectScaleSummary();

    res.status(200).json({ scaleSummary });
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
