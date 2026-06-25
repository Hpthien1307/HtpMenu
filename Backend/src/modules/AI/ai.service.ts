import { Injectable } from "@nestjs/common"
import { GoogleGenAI, Type } from "@google/genai"

@Injectable()
export class AiService {
  private ai: GoogleGenAI

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  }

  async getMenuRecommendations(menuData: any[], context: { time: string; weather: string }) {
    try {
      const prompt = `
        Bạn là một chuyên gia tối ưu doanh số nhà hàng (Up-selling và Cross-selling).
        Dưới đây là danh sách menu hiện tại của quán ăn dưới dạng JSON:
        ${JSON.stringify(menuData)}

        Hãy dựa vào ngữ cảnh hiện tại của khách hàng:
        - Thời gian: ${context.time}
        - Thời tiết: ${context.weather}

        Yêu cầu:
        1. Hãy chọn ra từ 2 đến 3 món ăn PHÙ HỢP NHẤT với thời gian và thời tiết này để gợi ý lên đầu trang.
        2. Tạo ra 1 gợi ý "Combo thông minh" bằng cách gộp các món lẻ có sẵn trong menu lại với nhau (kèm theo tên combo tự chế và lý do gợi ý thuyết phục).

        Hãy trả về kết quả CHÍNH XÁC theo cấu trúc định dạng JSON được yêu cầu bên dưới, không thêm bớt bất kỳ từ ngữ thừa nào bên ngoài cục JSON.
      `

      // Gọi mô hình gemini-2.5-flash (tối ưu cho tốc độ và xử lý cấu trúc JSON)
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          // Ép mô hình trả về dữ liệu chuẩn JSON theo cấu trúc (Schema) định sẵn
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Danh sách các ID món ăn lẻ được gợi ý theo thời tiết/thời gian."
              },
              smartCombo: {
                type: Type.OBJECT,
                properties: {
                  comboName: { type: Type.STRING },
                  productIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                  discountPrice: { type: Type.NUMBER, description: "Giá combo sau khi giảm nhẹ để kích cầu" },
                  reason: { type: Type.STRING, description: "Lý do gợi ý combo này bằng tiếng Việt." }
                },
                required: ["comboName", "productIds", "discountPrice", "reason"]
              }
            },
            required: ["recommendedProductIds", "smartCombo"]
          }
        }
      })

      // Parse kết quả JSON trả về từ Gemini và gửi về cho Controller
      return JSON.parse(response.text)
    } catch (error) {
      console.warn("AI Service error, falling back to local recommendations: ", error.message)
      return this.getFallbackRecommendations(menuData, context)
    }
  }

  private getFallbackRecommendations(menuData: any[], context: { time: string; weather: string }) {
    if (!menuData || menuData.length === 0) {
      return {
        recommendedProductIds: [],
        smartCombo: {
          comboName: "Combo Ăn Vặt Thỏa Thích",
          productIds: [],
          discountPrice: 0,
          reason: "Thưởng thức các món ngon của quán!"
        }
      }
    }

    // 1. Lọc ra danh sách món lẻ (ví dụ 3 món đầu tiên)
    const recommendedProductIds = menuData.slice(0, Math.min(3, menuData.length)).map(p => p.id)

    // 2. Gộp 2 món đầu tiên làm combo
    const comboProducts = menuData.slice(0, Math.min(2, menuData.length))
    const originalPrice = comboProducts.reduce((sum, p) => sum + (p.price || 0), 0)
    const discountPrice = Math.round(originalPrice * 0.9) // Giảm giá 10%

    const isHot =
      context.weather.includes("nắng") ||
      context.weather.includes("Nắng") ||
      context.weather.includes("nóng") ||
      context.weather.includes("Nóng")
    const isRainy =
      context.weather.includes("mưa") ||
      context.weather.includes("Mưa") ||
      context.weather.includes("lạnh") ||
      context.weather.includes("Lạnh")

    const comboName = isHot ? "Combo Giải Nhiệt Mùa Hè 🍹" : isRainy ? "Combo Ấm Áp Ngày Mưa Lạnh 🍲" : "Combo Tiện Lợi Tiết Kiệm 🍱"

    const reason = isHot
      ? `Thời tiết ${context.weather} oi bức cực kỳ lý tưởng để thưởng thức combo thanh mát này giúp cơ thể sảng khoái tức thì.`
      : isRainy
        ? `Trời đang ${context.weather}, một combo nóng hổi, cay nồng sẽ sưởi ấm chiếc bụng đói của bạn ngay lập tức.`
        : `Sự kết hợp hoàn hảo giữa các món ăn bán chạy nhất của quán giúp bạn có bữa ăn trọn vẹn hương vị và tiết kiệm.`

    return {
      recommendedProductIds,
      smartCombo: {
        comboName,
        productIds: comboProducts.map(p => p.id),
        discountPrice,
        reason
      }
    }
  }
}
