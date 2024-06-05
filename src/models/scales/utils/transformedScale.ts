import { IRecordSet } from "mssql";
import { IScale } from "../scales";

interface IRecordSetScale {
  id: string;
  name: string;
  date: Date;
  idTurn: number;
  status: number;
  options: { id: number; type: string }[];
}

export function transformedScale(scale: IRecordSet<IRecordSetScale>) {
  /*   console.log("scale", scale); */

  return scale.map((item) => {
    let objScale = {};
    const data = Object.entries(item).map(([_key, value], index) => {
      let array = [];
      /*       console.log(key, value, index) */

      if (index > 4) {
        array.push({ id: index - 4, type: value });
      }

      return array;
    });

    const options = data.flat();

    let index = options.findIndex(
      (option) => option.type === "T" || option.type === "R"
    );

    objScale = {
      id: item.id,
      name: item.name,
      date: item.date,
      /*  turn: item.idTurn === 1 ? "T1": item.idTurn === 2 ? "T2" : item.idTurn === 3 && "T3", */
      turn:
        index >= 0 && index <= 7
          ? "T1"
          : index >= 8 && index <= 14
            ? "T2"
            : index >= 15 && index <= 30 && "T3",
      status: item.status === 1 ? true : false,
      options: options,
    };

    return objScale;
  });
}
