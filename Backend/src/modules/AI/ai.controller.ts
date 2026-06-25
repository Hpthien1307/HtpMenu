import { Controller, Get, Query } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service"
import { AiService } from "./ai.service"

@Controller("ai")
export class AiController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService
  ) {}

  @Get("recommendations")
  async getRecommendations(@Query("weather") weather: string) {
    // 1. Lấy toàn bộ danh sách món ăn đang mở bán trong PostgreSQL ra (sử dụng schema đúng: isAvailable và name)
    const dbProducts = await this.prisma.product.findMany({
      where: { isAvailable: true },
      select: { id: true, name: true, price: true }
    })

    // Map properties sang productName để tương thích với model dùng ở Frontend
    const activeProducts = dbProducts.map(p => ({
      id: p.id,
      productName: p.name,
      price: p.price
    }))

    // 2. Xác định khung giờ hiện tại của hệ thống để làm ngữ cảnh
    const currentHour = new Date().getHours()
    const timeContext =
      currentHour >= 5 && currentHour < 11 ? "Buổi sáng" : currentHour >= 11 && currentHour < 17 ? "Buổi trưa" : "Buổi tối"

    // 3. Đẩy data sang cho Service gọi Gemini phân tích
    const aiResult = await this.aiService.getMenuRecommendations(activeProducts, {
      time: timeContext,
      weather: weather || "Bình thường" // Ví dụ: "Trời mưa lạnh" hoặc "Nắng nóng 38 độ"
    })

    return aiResult
  }
}
