import { Employee } from "../../models/employees.model"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service"

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getEmployees(): Promise<Employee[]> {
    const dbEmployees = await this.prismaService.employee.findMany()
    return dbEmployees.map(dbEmployee => new Employee(dbEmployee))
  }

  async getDetailEmployee(id: string): Promise<Employee> {
    const dbEmployee = await this.prismaService.employee.findUnique({
      where: { id }
    })
    if (!dbEmployee) {
      throw new Error(`Employee with id ${id} not found`)
    }
    return new Employee(dbEmployee)
  }

  async createEmployee(employeeData: any): Promise<Employee> {
    const dbEmployee = await this.prismaService.employee.create({
      data: {
        name: employeeData.name,
        avatar: employeeData.avatar || "",
        position: employeeData.position,
        salary: Number(employeeData.salary),
        startDate: employeeData.startDate ? new Date(employeeData.startDate) : new Date()
      }
    })
    return new Employee(dbEmployee)
  }

  async updateEmployee(id: string, updatedData: Partial<Employee>): Promise<Employee> {
    const dbEmployee = await this.prismaService.employee.update({
      where: { id },
      data: {
        name: updatedData.name,
        avatar: updatedData.avatar,
        position: updatedData.position,
        salary: updatedData.salary !== undefined ? Number(updatedData.salary) : undefined,
        startDate: updatedData.startDate ? new Date(updatedData.startDate) : undefined
      }
    })
    return new Employee(dbEmployee)
  }

  async deleteEmployee(id: string): Promise<Employee> {
    const dbEmployee = await this.prismaService.employee.delete({
      where: { id }
    })
    return new Employee(dbEmployee)
  }
}
