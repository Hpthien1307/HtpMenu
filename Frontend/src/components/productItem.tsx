import { FormatPrice } from "@/utils/formatters."
import Quantity from "@/components/quantity"

// enum ProductCategories {
//   COMBO = "Combo",
//   CHICKEN = "Gà rán",
//   FRIED_CHICKEN_SAUCE = "Xốt gà rán",
//   SPICY_NOODLES = "Mỳ cay",
//   SPICY_NOODLE_TOPPING = "Topping Mỳ cay",
//   RICE_SOUP_HOTPOT = "Cơm, canh và lẩu",
//   SNACKS = "Ăn vặt",
//   DRINK = "Đồ uống"
// }
export interface ProductProps {
  id: string
  isActive?: boolean
  categoryId?: string
  thumbnail?: string
  productName?: string
  price?: number
  layout?: "list" | "grid"
}
export interface ProductItemProps {
  product: ProductProps
}

export const ProductsItem = ({ product }: ProductItemProps) => {
  return (
    <div className={`product-item ${product.layout}`}>
      <div className={`${product.layout === "grid" ? "flex-col" : ""} flex overflow-hidden rounded-2xl border border-gray-200`}>
        <div className={`${product.layout === "grid" ? "w-full" : "w-[16rem] max-sm:w-[30%]"} aspect-square shrink-0`}>
          <div className="relative overflow-hidden pt-[100%]">
            <img
              src={product.thumbnail || "/empty.jpg"}
              alt={product.productName || "tên sản phẩm đang cập nhật"}
              className="img-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="wrap-content w-full p-4">
          <div className="flex flex-col justify-between gap-4 h-full">
            <span className="text-3xl max-md:text-2xl capitalize line-clamp-2">{product.productName || "tên sản phẩm đang cập nhật"}</span>
            <div className=" max-w-full flex justify-between items-end gap-4 flex-wrap">
              <div className="text-3xl font-medium max-md:text-2xl">{FormatPrice(product.price) || "giá đang được cập nhật"}</div>
              <Quantity productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
