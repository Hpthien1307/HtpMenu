// orders/entities/order.entity.ts

export enum OrderStatus {
  PENDING = "Chờ xử lý",
  COOKING = "Đang nấu",
  COMPLETED = "Hoàn thành",
  CANCELLED = "Đã hủy"
}

export enum PaymentStatus {
  UNPAID = "Chưa thanh toán",
  PAID = "Đã thanh toán"
}

export class Order {
  id?: string
  tableId?: string
  totalPrice?: number
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  createdAt?: Date
  items?: OrderItem[]
  constructor(data: Partial<Order> = {}) {
    Object.assign(this, data)
  }
}

export class OrderItem {
  id?: string
  orderId?: string
  productId?: string
  quantity?: number
  note?: string
  constructor(data: Partial<OrderItem> = {}) {
    Object.assign(this, data)
  }
}
