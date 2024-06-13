import { formatInTimeZone } from "date-fns-tz";
import { IEmployee } from "src/models/settings/settings";

interface IDayOff {
  id: number;
  date: string;
  type?: string;
}

interface IVacation {
  id: number;
  startVacation: string;
  finishVacation: string;
  type?: string;
}

export function filterDayOffAndVacation(data: IEmployee[]) {
  data.map((item) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const filteredArrayDayOff: IDayOff[] = [];
    const filteredVacation: IVacation[] = [];

    item.arrayDaysOff.forEach((dayOff) => {
      const dateFormated = formatInTimeZone(dayOff.date, "UTC", "dd-MM-yyyy");

      var partsOfDate = dateFormated.split("-");

      // Obter mês e ano a partir das partes
      var month = parseInt(partsOfDate[1], 10);
      var year = parseInt(partsOfDate[2], 10);

      if (month >= currentMonth && year >= currentYear) {
        filteredArrayDayOff.push(dayOff);
      }
    });

    item.arrayDaysOff = filteredArrayDayOff;

    item.arrayVacation.forEach((dateVacation) => {
      const dateFinishVacation = formatInTimeZone(
        dateVacation.finishVacation,
        "UTC",
        "dd-MM-yyyy"
      );

      var partsOfDate = dateFinishVacation.split("-");

      var month = parseInt(partsOfDate[1], 10);
      var year = parseInt(partsOfDate[2], 10);

      if (month >= currentMonth && year >= currentYear) {
        filteredVacation.push(dateVacation);
      }
    });

    item.arrayVacation = filteredVacation;
  });

  return data;
}
