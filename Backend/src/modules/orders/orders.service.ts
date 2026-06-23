import { Injectable } from "@nestjs/common"
import { Order, OrderItem, OrderStatus, PaymentStatus } from "@/models/orders.model"
import { PrismaService } from "@/prisma/prisma.service"

const orderStatusStrMap = ["PENDING", "COOKING", "COMPLETED", "CANCELLED"]
const paymentStatusStrMap = ["UNPAID", "PAID"]

function getStatusString(status: any): string {
  if (typeof status === "number") {
    return orderStatusStrMap[status] || "PENDING"
  }
  return String(status || "PENDING")
}

function getPaymentStatusString(status: any): string {
  if (typeof status === "number") {
    return paymentStatusStrMap[status] || "UNPAID"
  }
  return String(status || "UNPAID")
}

function mapOrder(dbOrder: any): Order {
  const statusStr = dbOrder.status as string
  const paymentStatusStr = dbOrder.paymentStatus as string

  return new Order({
    id: dbOrder.id,
    tableId: dbOrder.tableId,
    totalPrice: dbOrder.totalPrice,
    status: OrderStatus[statusStr as keyof typeof OrderStatus] ?? OrderStatus.PENDING,
    paymentStatus: PaymentStatus[paymentStatusStr as keyof typeof PaymentStatus] ?? PaymentStatus.UNPAID,
    createdAt: dbOrder.createdAt,
    items: (dbOrder.items || []).map(
      (dbItem: any) =>
        new OrderItem({
          id: dbItem.id,
          orderId: dbItem.orderId,
          productId: dbItem.productId,
          quantity: dbItem.quantity,
          note: dbItem.note
        })
    )
  })
}

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOrders(): Promise<Order[]> {
    const dbOrders = await this.prismaService.order.findMany({
      include: {
        items: true
      }
    })
    return dbOrders.map(mapOrder)
  }

  async getOrderDetail(id: string): Promise<Order> {
    const dbOrder = await this.prismaService.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    })
    if (!dbOrder) {
      throw new Error(`Order with id ${id} not found`)
    }
    return mapOrder(dbOrder)
  }

  async createOrder(orderData: any): Promise<Order> {
    let finalTableId = orderData.tableId

    // Fallback if tableId is missing or invalid in DB
    if (!finalTableId) {
      const firstTable = await this.prismaService.table.findFirst()
      if (firstTable) {
        finalTableId = firstTable.id
      }
    } else {
      const tableExists = await this.prismaService.table.findUnique({
        where: { id: finalTableId }
      })
      if (!tableExists) {
        const firstTable = await this.prismaService.table.findFirst()
        if (firstTable) {
          finalTableId = firstTable.id
        }
      }
    }

    if (!finalTableId) {
      throw new Error("No tables available in the database to assign this order to.")
    }

    const dbOrder = await this.prismaService.order.create({
      data: {
        tableId: finalTableId,
        totalPrice: Number(orderData.totalPrice),
        status: getStatusString(orderData.status),
        paymentStatus: getPaymentStatusString(orderData.paymentStatus),
        createdAt: orderData.createdAt ? new Date(orderData.createdAt) : new Date(),
        items: {
          create: (orderData.items || []).map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            note: item.note
          }))
        }
      },
      include: {
        items: true
      }
    })
    return mapOrder(dbOrder)
  }

  async updateOrder(id: string, updatedData: Partial<Order>): Promise<Order> {
    const dbOrder = await this.prismaService.order.update({
      where: { id },
      data: {
        tableId: updatedData.tableId,
        totalPrice: updatedData.totalPrice !== undefined ? Number(updatedData.totalPrice) : undefined,
        status: updatedData.status !== undefined ? getStatusString(updatedData.status) : undefined,
        paymentStatus: updatedData.paymentStatus !== undefined ? getPaymentStatusString(updatedData.paymentStatus) : undefined,
        createdAt: updatedData.createdAt ? new Date(updatedData.createdAt) : undefined
      },
      include: {
        items: true
      }
    })
    return mapOrder(dbOrder)
  }

  async deleteOrder(id: string): Promise<Order> {
    const dbOrder = await this.prismaService.order.delete({
      where: { id },
      include: {
        items: true
      }
    })
    return mapOrder(dbOrder)
  }
}
