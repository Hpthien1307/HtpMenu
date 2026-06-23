import { useState, useEffect } from "react"
import { CartContext } from "@/hooks/useCart"

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Record<string, number>>(() => {
    const savedCart = localStorage.getItem("hpt_cart")
    return savedCart ? JSON.parse(savedCart) : {}
  })

  useEffect(() => {
    localStorage.setItem("hpt_cart", JSON.stringify(cart))
  }, [cart])

  const handleIncrease = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const handleDecrease = (productId: string) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0
      if (currentQty <= 1) {
        const nextCart = { ...prev }
        delete nextCart[productId]
        return nextCart
      }
      return {
        ...prev,
        [productId]: currentQty - 1
      }
    })
  }

  const getQuantity = (productId: string) => {
    return cart[productId] || 0
  }

  const clearCart = () => {
    setCart({})
  }

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItemCount,
        handleIncrease,
        handleDecrease,
        getQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
