export interface IEmployee {
  idSeler?: number;
  idDayOff?: number;
  storeCode?: string;
  userLogin?: string;
  name?: string;
  cpf: string | null
  startDate: Date | null
  newUser: boolean | null,
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
  extraEmployee: boolean
}

export interface IInfoAddEmployee {
  name: string
  newUser: boolean | null,
  position: string
  cpf: string | null
  selectedShift: number | false
  startDate: Date | null
  extraEmployee: boolean
  store: string
  branchName: string
}

export interface IInfoUpdateEmployee{
  name: string
  position: string
  cpf: string | null
  startDate: Date | null
  selectedShift: number | false
  extraEmployee: boolean
  storeCode: string
}

interface IEmployeStatus {
  idSeler: number | undefined;
  status: boolean;
}

export interface ISettings {
  employeeStatus: IEmployeStatus[];
  flowScale: string;
}

interface IShift {
  turn: string;
  startTime: string;
  endTime: string;
}

export interface IShifts {
  morning?: IShift;
  afternoon?: IShift;
  nocturnal?: IShift;
}
