// orders/entities/order.entity.ts

export enum OrderStatus {
  PENDING,
  COOKING,
  COMPLETED,
  CANCELLED
}

export enum PaymentStatus {
  UNPAID,
  PAID
}

export class Order {
  id: string
  tableId: string
  totalPrice: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: Date
  items: OrderItem[]
  constructor({ id, tableId, totalPrice, status, paymentStatus, createdAt, items }) {
    if (id !== null) this.id = id
    if (tableId !== null) this.tableId = tableId
    if (totalPrice !== null) this.totalPrice = totalPrice
    if (status !== null) this.status = status
    if (paymentStatus !== null) this.paymentStatus = paymentStatus
    if (createdAt !== null) this.createdAt = createdAt
    if (items !== null) this.items = items
  }
}

export class OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  note?: string
  constructor({ id, orderId, productId, quantity, note }) {
    if (id !== null) this.id = id
    if (orderId !== null) this.orderId = orderId
    if (productId !== null) this.productId = productId
    if (quantity !== null) this.quantity = quantity
    if (note !== null) this.note = note
  }
}
