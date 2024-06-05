export interface IEmployee {
  idSeler?: number;
  idDayOff?: number;
  storeCode?: string;
  userLogin?: string;
  name?: string;
  status?: number;
  office?: string;
  idShift?: number;
  shift: string | null;
  startTime?: string;
  finishTime?: string;
  startVacation: string | null;
  finishVacation: string | null;
  typeAbsence: string;
  arrayDaysOff: {
    id: number;
    date: string;
    type?: string;
  }[];
  arrayVacation: {
    id: number;
    startVacation: string;
    finishVacation: string;
    type?:string
  }[];
  flowScale?: string;
}

interface IEmployeStatus {
  idSeler: number | undefined;
  status: boolean;
}

export interface ISettings {
  employeeStatus: IEmployeStatus[];
  flowScale: string;
}
