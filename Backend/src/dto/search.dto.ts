import { IsString, IsOptional } from "class-validator"

export class SearchDto {
  @IsOptional()
  @IsString({ message: "Từ khoá tìm kiếm phải là chuỗi" })
  keyword?: string

  @IsOptional()
  @IsString({ message: "Mã danh mục phải là chuỗi" })
  categories?: string
}
