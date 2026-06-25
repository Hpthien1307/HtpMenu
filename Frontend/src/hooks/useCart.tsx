import { createContext, useContext } from "react"

export interface CartContextType {
  cart: Record<string, number>
  cartItemCount: number
  handleIncrease: (productId: string) => void
  handleDecrease: (productId: string) => void
  getQuantity: (productId: string) => number
  clearCart: () => void
  addItemsToCart: (productIds: string[]) => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
