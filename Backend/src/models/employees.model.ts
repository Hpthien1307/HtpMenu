export class Employee {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  salary: number;
  startDate: Date;
  constructor({id, name, avatar, position, salary, startDate}){
    if(id !== null) this.id = id;
    if(name !== null) this.name = name;
    if(avatar !== null) this.avatar = avatar;
    if(position !== null) this.position = position;
    if(salary !== null) this.salary = salary;
    if(startDate !== null) this.startDate = startDate;
  }
}