import { Injectable } from "@nestjs/common"
import { GoogleGenAI, Type } from "@google/genai"

@Injectable()
export class AiService {
  private ai: GoogleGenAI

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  }

  async getMenuRecommendations(
    products: any[],
    combos: any[],
    context: { time: string; weather: string }
  ) {
    try {
      const prompt = `
        Bạn là một chuyên gia tối ưu doanh số nhà hàng (Up-selling và Cross-selling).
        Dưới đây là danh sách thực đơn món ăn lẻ dưới dạng JSON:
        ${JSON.stringify(products)}

        Dưới đây là danh sách các Combo hiện có của nhà hàng dưới dạng JSON:
        ${JSON.stringify(combos)}

        Hãy dựa vào ngữ cảnh hiện tại của khách hàng:
        - Thời gian: ${context.time}
        - Thời tiết: ${context.weather}

        Yêu cầu:
        1. Hãy chọn ra từ 2 đến 3 món ăn lẻ PHÙ HỢP NHẤT với thời gian và thời tiết này để gợi ý lên đầu trang.
        2. Hãy chọn ra đúng 1 Combo PHÙ HỢP NHẤT trong danh sách các Combo hiện có của nhà hàng (kèm theo lý do gợi ý thuyết phục).

        Hãy trả về kết quả CHÍNH XÁC theo cấu trúc định dạng JSON được yêu cầu bên dưới, không thêm bớt bất kỳ từ ngữ thừa nào bên ngoài cục JSON.
      `

      // Gọi mô hình gemini-2.5-flash (tối ưu cho tốc độ và xử lý cấu trúc JSON)
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Danh sách các ID món lẻ được gợi ý theo thời tiết/thời gian."
              },
              smartCombo: {
                type: Type.OBJECT,
                properties: {
                  comboId: {
                    type: Type.STRING,
                    description: "ID của Combo được chọn từ danh sách Combo hiện có của nhà hàng."
                  },
                  reason: {
                    type: Type.STRING,
                    description: "Lý do gợi ý combo này bằng tiếng Việt."
                  }
                },
                required: ["comboId", "reason"]
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
      return this.getFallbackRecommendations(products, combos, context)
    }
  }

  private getFallbackRecommendations(
    products: any[],
    combos: any[],
    context: { time: string; weather: string }
  ) {
    // 1. Lọc ra danh sách món lẻ (ví dụ 3 món đầu tiên)
    const recommendedProductIds = products.slice(0, Math.min(3, products.length)).map(p => p.id)

    // 2. Chọn combo từ database dựa trên từ khóa hoặc gán chỉ số thông minh nếu database ít combo
    let selectedCombo = combos[0]
    if (combos.length > 0) {
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

      // Thử tìm combo có từ khóa khớp trong tên hoặc các món ăn trong đó
      const found = combos.find(c => {
        const comboText = (c.comboName + " " + (c.items ? c.items.join(" ") : "")).toLowerCase()
        if (isHot) {
          return comboText.includes("mát") || comboText.includes("hè") || comboText.includes("lạnh") || comboText.includes("nước") || comboText.includes("trà") || comboText.includes("cola")
        }
        if (isRainy) {
          return comboText.includes("nóng") || comboText.includes("ấm") || comboText.includes("lẩu") || comboText.includes("cay") || comboText.includes("mỳ") || comboText.includes("mì")
        }
        return false
      })

      if (found) {
        selectedCombo = found
      } else if (combos.length >= 3) {
        // Nếu không khớp từ khóa nhưng có đủ 3 combo, ta phân bổ theo danh mục thời tiết để giao diện sinh động
        if (isHot) {
          selectedCombo = combos[2] // Chọn Combo Ăn Vặt Nhóm (có Coca Lạnh)
        } else if (isRainy) {
          selectedCombo = combos[0] // Chọn Combo Mỳ Cay & Trà Đào
        } else {
          selectedCombo = combos[1] // Chọn Combo 5 Miếng Gà Giòn cho thời tiết Mát Mẻ
        }
      }
    }

    const comboId = selectedCombo ? selectedCombo.id : ""
    const reason = `Thời tiết ${context.weather} rất thích hợp để thưởng thức combo này để tiếp thêm năng lượng.`

    return {
      recommendedProductIds,
      smartCombo: {
        comboId,
        reason
      }
    }
  }
}
