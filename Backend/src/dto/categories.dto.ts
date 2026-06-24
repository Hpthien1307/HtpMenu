import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator"

export class CategoryDto {
  @IsNotEmpty({ message: "Tên danh mục không được để trống" })
  @IsString({ message: "Tên danh mục phải là chuỗi" })
  categoryName: string

  @IsOptional()
  @IsBoolean({ message: "Trạng thái hoạt động phải là boolean" })
  isActive?: boolean
}
