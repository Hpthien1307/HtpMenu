import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { feedbackSchema, type FeedbackFormInput } from "../schema/feedbackSchema"
import { showToast } from "@/utils/showToasts"
import { User, Calendar, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const FeedbackForm = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FeedbackFormInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      gender: undefined,
      birthYear: undefined as any,
      content: ""
    }
  })

  const onSubmit = async (data: FeedbackFormInput) => {
    try {
      // Gọi API gửi góp ý
      const res = await fetch("http://localhost:3000/opinions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        throw new Error("API error")
      }

      showToast.success("Cảm ơn bạn đã gửi ý kiến đóng góp quý báu!")
      reset()
    } catch (error) {
      console.error("Gửi phản hồi thất bại:", error)
      showToast.error("Gửi phản hồi thất bại. Vui lòng thử lại!")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Giới tính */}
      <div className="flex flex-col gap-2">
        <label htmlFor="gender" className="text-2xl font-medium text-gray-700 flex items-center gap-2">
          <User size={18} className="text-gray-400" />
          Giới tính
        </label>
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="gender" className="w-full focus:border-blue-600">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-gray-100 shadow-lg bg-white">
                <SelectItem className="text-2xl py-3 px-4 hover:bg-gray-50 cursor-pointer rounded-xl" value="MALE">
                  Nam
                </SelectItem>
                <SelectItem className="text-2xl py-3 px-4 hover:bg-gray-50 cursor-pointer rounded-xl" value="FEMALE">
                  Nữ
                </SelectItem>
                <SelectItem className="text-2xl py-3 px-4 hover:bg-gray-50 cursor-pointer rounded-xl" value="OTHER">
                  Khác
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && (
          <span className="text-red-500 text-lg font-medium mt-1 animate-in fade-in slide-in-from-top-1">{errors.gender.message}</span>
        )}
      </div>

      {/* Năm sinh */}
      <div className="flex flex-col gap-2">
        <label htmlFor="birthYear" className="text-2xl font-medium text-gray-700 flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          Năm sinh
        </label>
        <Input
          id="birthYear"
          type="number"
          placeholder="Ví dụ: 1998"
          {...register("birthYear")}
          className={`w-full bg-white focus:border-blue-600 transition-all duration-300 ${
            errors.birthYear ? "border-red-500 focus:border-red-500" : "border-gray-200"
          }`}
        />
        {errors.birthYear && (
          <span className="text-red-500 text-lg font-medium mt-1 animate-in fade-in slide-in-from-top-1">{errors.birthYear.message}</span>
        )}
      </div>

      {/* Ý kiến đóng góp */}
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="text-2xl font-medium text-gray-700 flex items-center gap-2">
          <MessageSquare size={18} className="text-gray-400" />Ý kiến đóng góp
        </label>
        <Textarea
          id="content"
          placeholder="Hãy chia sẻ trải nghiệm hoặc đóng góp ý kiến của bạn về quán..."
          rows={6}
          {...register("content")}
          className={`w-full min-h-50 focus:border-blue-600 resize-none transition-all duration-300 ${
            errors.content ? "border-red-500 focus:border-red-500" : "border-gray-200"
          }`}
        />
        {errors.content && (
          <span className="text-red-500 text-lg font-medium mt-1 animate-in fade-in slide-in-from-top-1">{errors.content.message}</span>
        )}
      </div>

      {/* Button Submit */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        <span>Gửi góp ý</span>
      </Button>
    </form>
  )
}
