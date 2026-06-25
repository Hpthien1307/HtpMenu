import { ChevronLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import WrapperMain from "@/components/wrapperMain"
import useFetch from "@/hooks/useFetch"
import { useCart } from "@/hooks/useCart"
import { Skeleton } from "@/components/ui/skeleton"
import ErrorView from "@/components/ui/error"
import { ProductsItem } from "@/components/productItem"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FormatPrice } from "@/utils/formatters."
import { useState } from "react"
import { showToast } from "@/utils/showToasts"
import { Spinner } from "@/components/ui/spinner"
import type { ProductProps } from "@/components/productItem"
import { API_URL } from "@/config/environment"

const Cart = () => {
  const { cart, cartItemCount, clearCart } = useCart()
  const navigate = useNavigate()
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: products,
    isPending: isPendingProducts,
    error: errorProducts
  } = useFetch({
    url: `${API_URL}/products`,
    key: ["products"]
  })

  const {
    data: combos,
    isPending: isPendingCombos,
    error: errorCombos
  } = useFetch({
    url: `${API_URL}/products/combos`,
    key: ["combos"]
  })

  const mergedProducts =
    products?.data && combos?.data
      ? [
          ...products.data,
          ...combos.data.map((combo: ProductProps) => ({
            id: combo.id,
            productName: combo.productName,
            price: combo.price,
            thumbnail: combo.thumbnail,
            isActive: combo.isActive,
            categoryId: "combo-category-id"
          }))
        ]
      : products?.data || []

  const cartProducts = mergedProducts.filter((product: ProductProps) => cart[product.id]) || []
  const totalProductsPrice = cartProducts.reduce(
    (sum: number, product: ProductProps) => sum + (product.price || 0) * (cart[product.id] || 0),
    0
  )
  const totalPrice = totalProductsPrice
  const isPending = isPendingProducts || isPendingCombos
  const error = errorProducts || errorCombos

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (cartItemCount === 0) {
      showToast.warning("Giỏ hàng của bạn đang trống!")
      return
    }

    // Lấy tableId từ URL query param (?tableId=...) hoặc localStorage, hoặc mặc định
    const params = new URLSearchParams(window.location.search)
    const tableId = params.get("tableId") || localStorage.getItem("tableId") || "default-table-id"

    setIsSubmitting(true)
    try {
      const orderItems = cartProducts.map((product: ProductProps) => ({
        productId: product.id,
        quantity: cart[product.id] || 1,
        note: note || undefined
      }))

      const payload = {
        tableId,
        totalPrice,
        items: orderItems
      }

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error("Không thể kết nối đến máy chủ.")
      }

      const resData = await res.json()
      if (resData.statusCode !== 200 && resData.statusCode !== 201) {
        throw new Error(resData.message || "Đặt món thất bại.")
      }

      showToast.success("Đặt món thành công! Vui lòng đợi trong giây lát.")
      clearCart()
      setNote("")
      setTimeout(() => {
        navigate("/")
      }, 200)
    } catch (error) {
      console.error("Lỗi đặt món:", error)
      showToast.error("Đặt món thất bại. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <WrapperMain classCustom="page-cart bg-gray-100">
      <section className="sec-cart">
        <form onSubmit={onSubmit}>
          <div className="cart flex flex-col gap-y-4">
            <div className="cart-head bg-white sticky top-0 left-0 w-full z-50 py-4 px-2">
              <Link to={"/"} className="flex items-center gap-2 text-3xl">
                <ChevronLeft size={24} />
                <span>Thực đơn</span>
              </Link>
            </div>
            <div className="cart-main">
              <div className="container">
                <div className="cart-wrap flex flex-col gap-4">
                  <div className="flex flex-col gap-6 bg-white rounded-2xl p-6">
                    <div className="flex justify-between gap-4">
                      <p>Món đã chọn ({cartItemCount})</p>
                      <Link className="font-medium text-blue-600" to={"/"}>
                        <span>Thêm món</span>
                      </Link>
                    </div>
                    <div className="cart-list flex flex-col gap-y-6">
                      {isPending ? (
                        Array.from({ length: 5 }).map((_, index) => <Skeleton className="w-full h-[12rem] rounded-2xl" key={index} />)
                      ) : error ? (
                        <ErrorView />
                      ) : cartProducts.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">Giỏ hàng đang trống</p>
                      ) : (
                        cartProducts.map((product: ProductProps) => (
                          <ProductsItem key={product.id} product={{ ...product, layout: "list" }} />
                        ))
                      )}
                    </div>
                  </div>
                  <div className="cart-desc bg-white rounded-2xl p-6">
                    <Textarea
                      placeholder="Cho quán biết thêm yêu cầu của bạn"
                      className="min-h-60 p-4"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 w-full bg-white">
            <div className="container">
              <div className="py-4 rounded-t-3xl shadow-2xs flex flex-col gap-6">
                <div className="flex justify-between gap-4">
                  <p>Tổng tiền ({cartItemCount || 0}) món</p>
                  <span className="font-semibold">{FormatPrice(totalPrice || 0)}</span>
                </div>
                <Button type="submit" disabled={isSubmitting || cartItemCount === 0}>
                  {isSubmitting && <Spinner />}
                  <span>{isSubmitting ? "Đang xử lý..." : "Xác nhận"}</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </WrapperMain>
  )
}

export default Cart
