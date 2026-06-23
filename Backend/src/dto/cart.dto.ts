import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from "class-validator"

export class CartDto {
  @IsNotEmpty({ message: "Bàn không được để trống" })
  @IsString({ message: "Mã bàn phải là chuỗi" })
  tableId: string

  @IsNotEmpty({ message: "Sản phẩm không được để trống" })
  @IsString({ message: "Mã sản phẩm phải là chuỗi" })
  productId: string

  @IsNotEmpty({ message: "Số lượng không được để trống" })
  @IsInt({ message: "Số lượng phải là số nguyên" })
  @Min(1, { message: "Số lượng phải lớn hơn hoặc bằng 1" })
  quantity: number

  @IsOptional()
  @IsString({ message: "Ghi chú phải là chuỗi" })
  note?: string
}

export class UpdateCartDto {
  @IsOptional()
  @IsInt({ message: "Số lượng phải là số nguyên" })
  @Min(1, { message: "Số lượng phải lớn hơn hoặc bằng 1" })
  quantity?: number

  @IsOptional()
  @IsString({ message: "Ghi chú phải là chuỗi" })
  note?: string
}
