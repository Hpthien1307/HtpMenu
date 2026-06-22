import { MinLength, IsNotEmpty, IsNumber } from "class-validator"

export class ProductDto {
  @IsNotEmpty({ message: "category không được để rỗng" })
  categoryId?: string
  @IsNotEmpty({ message: "Thumnail không được để rỗng" })
  thumbnail?: string
  @MinLength(1, { message: "Tên sản phẩm phải có ít nhất 5 kí tự" })
  @IsNotEmpty({ message: "Tên sản phẩm không được để rỗng" })
  productName?: string
  @IsNumber({}, { message: "giá sản phẩm phải là số" })
  @IsNotEmpty({ message: "giá sản phẩm không được để rỗng" })
  price?: number
  isActive?: boolean
}
