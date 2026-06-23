import { Product } from "./products.model"

export class Cart {
  id: string
  tableId: string
  productId: string
  quantity: number
  note?: string
  createdAt: Date
  updatedAt: Date
  product?: Product

  constructor({ id, tableId, productId, quantity, note, createdAt, updatedAt, product }: Partial<Cart> = {}) {
    if (id !== undefined && id !== null) this.id = id
    if (tableId !== undefined && tableId !== null) this.tableId = tableId
    if (productId !== undefined && productId !== null) this.productId = productId
    if (quantity !== undefined && quantity !== null) this.quantity = quantity
    if (note !== undefined && note !== null) this.note = note
    if (createdAt !== undefined && createdAt !== null) this.createdAt = createdAt
    if (updatedAt !== undefined && updatedAt !== null) this.updatedAt = updatedAt
    if (product !== undefined && product !== null) this.product = product
  }
}
