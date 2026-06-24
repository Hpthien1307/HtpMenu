import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

export class OrderItemDto {
  @IsNotEmpty({ message: "Mã sản phẩm không được để trống" })
  @IsString({ message: "Mã sản phẩm phải là chuỗi" })
  productId: string

  @IsNotEmpty({ message: "Số lượng không được để trống" })
  quantity: any // accepts number or numeric string as the service parses it with Number()

  @IsOptional()
  @IsString({ message: "Ghi chú phải là chuỗi" })
  note?: string
}

export class OrderDto {
  @IsOptional()
  @IsString({ message: "Mã bàn phải là chuỗi" })
  tableId?: string

  @IsNotEmpty({ message: "Tổng tiền không được để trống" })
  totalPrice: any // accepts number or numeric string

  @IsOptional()
  status?: any

  @IsOptional()
  paymentStatus?: any

  @IsOptional()
  createdAt?: any

  @IsOptional()
  @IsArray({ message: "Danh sách sản phẩm phải là mảng" })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[]
}
