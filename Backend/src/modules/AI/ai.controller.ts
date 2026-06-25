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
    // 1. Lấy danh sách món ăn lẻ đang mở bán
    const dbProducts = await this.prisma.product.findMany({
      where: { isAvailable: true },
      select: { id: true, name: true, price: true }
    })

    const activeProducts = dbProducts.map(p => ({
      id: p.id,
      productName: p.name,
      price: p.price
    }))

    // 2. Lấy danh sách các Combo đang kích hoạt kèm chi tiết món
    const dbCombos = await this.prisma.combo.findMany({
      where: { isActive: true },
      include: {
        comboItems: {
          include: {
            product: true
          }
        }
      }
    })

    const activeCombos = dbCombos.map(c => ({
      id: c.id,
      comboName: c.name,
      price: c.price,
      items: c.comboItems.map(item => item.product.name)
    }))

    // 3. Xác định khung giờ hiện tại
    const currentHour = new Date().getHours()
    const timeContext =
      currentHour >= 5 && currentHour < 11 ? "Buổi sáng" : currentHour >= 11 && currentHour < 17 ? "Buổi trưa" : "Buổi tối"

    // 4. Đẩy sang cho Service phân tích
    const aiResult = await this.aiService.getMenuRecommendations(activeProducts, activeCombos, {
      time: timeContext,
      weather: weather || "Bình thường"
    })

    return aiResult
  }
}
