import { z } from "zod"

const currentYear = new Date().getFullYear()

export const feedbackSchema = z.object({
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    errorMap: () => ({ message: "Vui lòng chọn giới tính" })
  }),
  birthYear: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập năm sinh" })
    .int("Năm sinh phải là số nguyên")
    .min(1900, "Năm sinh không hợp lệ (từ 1900 trở đi)")
    .max(currentYear, `Năm sinh không được vượt quá năm ${currentYear}`),
  content: z
    .string()
    .min(10, "Ý kiến đóng góp phải dài tối thiểu 10 ký tự")
    .max(1000, "Nội dung tối đa 1000 ký tự")
})

export type FeedbackFormInput = z.infer<typeof feedbackSchema>
