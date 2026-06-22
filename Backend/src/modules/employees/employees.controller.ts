import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { EmployeesService } from "@/modules/employees/employees.service";
import { ResponseData } from "@/global/globalClass";
import { HttpMessage, HttpStatus } from "@/global/globalEnum";
import { Employee } from "@/models/employees.model";

@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async getEmployees(): Promise<ResponseData<Employee[]>> {
    try {
      const data = await this.employeesService.getEmployees();
      return new ResponseData<Employee[]>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error getting all employees", error);
      return new ResponseData<Employee[]>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND);
    }
  }

  @Post()
  async createEmployee(@Body() employee: Employee): Promise<ResponseData<Employee>> {
    try {
      const data = await this.employeesService.createEmployee(employee);
      return new ResponseData<Employee>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error creating employee", error);
      return new ResponseData<Employee>(null, HttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST);
    }
  }

  @Get("/:id")
  async getDetailEmployee(@Param("id") id: string): Promise<ResponseData<Employee>> {
    try {
      const data = await this.employeesService.getDetailEmployee(id);
      return new ResponseData<Employee>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error getting detail employee", error);
      return new ResponseData<Employee>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND);
    }
  }

  @Put("/:id")
  async updateEmployee(
    @Param("id") id: string,
    @Body() employee: Partial<Employee>
  ): Promise<ResponseData<Employee>> {
    try {
      const data = await this.employeesService.updateEmployee(id, employee);
      return new ResponseData<Employee>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error updating employee", error);
      return new ResponseData<Employee>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND);
    }
  }

  @Delete("/:id")
  async deleteEmployee(@Param("id") id: string): Promise<ResponseData<Employee>> {
    try {
      const data = await this.employeesService.deleteEmployee(id);
      return new ResponseData<Employee>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error deleting employee", error);
      return new ResponseData<Employee>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND);
    }
  }
}
