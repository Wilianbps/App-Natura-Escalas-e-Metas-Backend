import { Request, Response } from "express";
import { selectPathBeepInput, selectStoreByUser } from "../../models/profiles/profilesModels";

export async function findStoreByUser(req: Request, res: Response) {
  try {
    const { user } = req.query;

    if (!user) return res.status(404).send();

    const result = await selectStoreByUser(user as string);

    res.status(200).json(result);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findPathBeepInput(_req: Request, res: Response) {
  try {
    const path = await selectPathBeepInput();
    res.status(200).json(path);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}
