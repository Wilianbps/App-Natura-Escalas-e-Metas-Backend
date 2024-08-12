import { Request, Response } from "express";
import { selectStoreByUser } from "../../models/profiles/profilesModels";

export async function findStoreByUser(req: Request, res: Response) {
  try {
    const { user, storeCode } = req.query;

    if (!user) return res.status(404).send();

    const result = await selectStoreByUser(user as string);

    console.log("result no controller", result)

    res.status(200).json(result);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}
