export class Employee {
  id?: string;
  name?: string;
  avatar?: string;
  position?: string;
  salary?: number;
  startDate?: Date;

  constructor(data: Partial<Employee> = {}) {
    Object.assign(this, data);
  }
}