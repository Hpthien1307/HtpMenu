import { Module } from "@nestjs/common";
import { EmployeesController } from "../../modules/employees/employees.controller";
import { EmployeesService } from "../../modules/employees/employees.service";

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService]
})
export class EmployeesModule {}
