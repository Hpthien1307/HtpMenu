import { IsNotEmpty, IsString, IsOptional } from "class-validator"

export class EmployeeDto {
  @IsNotEmpty({ message: "Tên nhân viên không được để trống" })
  @IsString({ message: "Tên nhân viên phải là chuỗi" })
  name: string

  @IsOptional()
  @IsString({ message: "Đường dẫn ảnh đại diện phải là chuỗi" })
  avatar?: string

  @IsNotEmpty({ message: "Vị trí công việc không được để trống" })
  @IsString({ message: "Vị trí công việc phải là chuỗi" })
  position: string

  @IsNotEmpty({ message: "Lương không được để trống" })
  salary: any // accepts number or numeric string as the service parses it using Number(salary)

  @IsOptional()
  startDate?: any // accepts date or date string
}
