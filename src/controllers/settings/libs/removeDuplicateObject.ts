import { IEmployee } from "src/models/settings/settings";

/* export function removeDuplicateObject(data: IEmployee[]) {
  const uniqueEmployees = new Map<number, IEmployee>();

   Primeiro, preencha o mapa com as entradas únicas, priorizando "FERIAS"
  for (const employee of data) {
     Verifica se idSeler não é undefined
    if (employee.idSeler !== undefined) {
       Verifica se já existe uma entrada para este idSeler no mapa
      if (!uniqueEmployees.has(employee.idSeler)) {
         Se não existir, adiciona este objeto diretamente ao mapa
        uniqueEmployees.set(employee.idSeler, employee);
      } else {
         Se já existir uma entrada para este idSeler, verifica o tipo de abstinência
        const existingEmployee = uniqueEmployees.get(employee.idSeler);
        if (existingEmployee && employee.typeAbsence === "FERIAS") {
           Se o tipo de abstinência do novo objeto for "FERIAS", substitui o existente
          uniqueEmployees.set(employee.idSeler, employee);
        }
      }
    }
  }

   uniqueEmployees.forEach((item) => {
    if (item.typeAbsence !== "FERIAS") {
      item.startVacation = "";
      item.finishVacation = "";
    }
  }); 


   Por fim, retorna apenas os valores únicos do mapa
  return Array.from(uniqueEmployees.values());
} */

export function removeDuplicateObject(data: IEmployee[]){
  const idsSelers = new Set();
    
  const employeesWithOutDuplicateObjects = data.filter((employee) => {
   
      if (idsSelers.has(employee.idSeler)) {
           return false;
         } else {
           idsSelers.add(employee.idSeler);
           return true;
         }
  });

  return employeesWithOutDuplicateObjects
}

