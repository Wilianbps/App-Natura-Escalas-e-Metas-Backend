export interface IScale {
  id: number;
  name?: string;
  date: string;
  turn: string;
  status: boolean;
  options: { id: number; type: string }[];
  infos?: {
    type?: string;
    values?: number[] | string[];
  };
}

export interface IScaleApproval {
  storeCode?: string
  description: string;
  responsible: string;
  branch: string;
  requestDate: string;
  approvalDate?: string;
  status: number;
}
