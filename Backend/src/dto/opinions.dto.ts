import { IsEnum, IsInt, IsNotEmpty, IsString, Min, Max } from "class-validator"
import { Gender } from "@/models/opinions.model"

export class OpinionsDto {
  @IsNotEmpty({ message: "Giới tính không được để trống" })
  @IsEnum(Gender, { message: "Giới tính không hợp lệ" })
  gender: Gender
  @IsNotEmpty({ message: "Năm sinh không được để trống" })
  @IsInt({ message: "Năm sinh phải là số nguyên" })
  @Min(1900, { message: "Năm sinh không hợp lệ (từ 1900 trở đi)" })
  @Max(2100, { message: "Năm sinh không hợp lệ" })
  birthYear: number
  @IsNotEmpty({ message: "Nội dung không được để trống" })
  @IsString({ message: "Nội dung phải là chuỗi" })
  content: string
  isRead?: boolean
  createdAt?: Date
}

