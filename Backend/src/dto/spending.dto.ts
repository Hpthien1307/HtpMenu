import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator"

export class SpendingDto {
  @IsNotEmpty({ message: "Tiêu đề không được để trống" })
  @IsString({ message: "Tiêu đề phải là chuỗi" })
  title: string

  @IsOptional()
  @IsString({ message: "Đường dẫn ảnh phải là chuỗi" })
  image?: string

  @IsNotEmpty({ message: "Tag không được để trống" })
  @IsString({ message: "Tag phải là chuỗi" })
  tag: string

  @IsOptional()
  price?: any // price can be string or number, as backend converts it with Number()

  @IsOptional()
  @IsNumber({}, { message: "Số lượng phải là số" })
  amount?: number

  @IsOptional()
  createdAt?: any
}
