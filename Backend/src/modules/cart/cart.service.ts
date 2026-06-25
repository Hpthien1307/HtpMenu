import { Injectable } from "@nestjs/common"
import { Cart } from "../../models/cart.model"
import { PrismaService } from "../../prisma/prisma.service"
import { CartDto, UpdateCartDto } from "../../dto/cart.dto"

function mapCart(dbCart: any): Cart {
  return new Cart({
    id: dbCart.id,
    tableId: dbCart.tableId,
    productId: dbCart.productId,
    quantity: dbCart.quantity,
    note: dbCart.note,
    createdAt: dbCart.createdAt,
    updatedAt: dbCart.updatedAt,
    product: dbCart.product
      ? {
          id: dbCart.product.id,
          isActive: dbCart.product.isAvailable,
          categoryId: dbCart.product.categoryId,
          thumbnail: dbCart.product.thumbnail,
          productName: dbCart.product.name,
          price: dbCart.product.price
        }
      : undefined
  })
}

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCartByTable(tableId: string): Promise<Cart[]> {
    const dbCarts = await this.prismaService.cart.findMany({
      where: { tableId },
      include: {
        product: true
      },
      orderBy: {
        createdAt: "asc"
      }
    })
    return dbCarts.map(mapCart)
  }

  async addToCart(cartDto: CartDto): Promise<Cart> {
    // Check if product exists
    const product = await this.prismaService.product.findUnique({
      where: { id: cartDto.productId }
    })
    if (!product) {
      throw new Error(`Product with id ${cartDto.productId} not found`)
    }

    // Check if table exists
    const table = await this.prismaService.table.findUnique({
      where: { id: cartDto.tableId }
    })
    if (!table) {
      throw new Error(`Table with id ${cartDto.tableId} not found`)
    }

    const dbCart = await this.prismaService.cart.upsert({
      where: {
        tableId_productId: {
          tableId: cartDto.tableId,
          productId: cartDto.productId
        }
      },
      update: {
        quantity: {
          increment: Number(cartDto.quantity)
        },
        note: cartDto.note !== undefined ? cartDto.note : undefined
      },
      create: {
        tableId: cartDto.tableId,
        productId: cartDto.productId,
        quantity: Number(cartDto.quantity),
        note: cartDto.note
      },
      include: {
        product: true
      }
    })
    return mapCart(dbCart)
  }

  async updateCartItem(id: string, updateDto: UpdateCartDto): Promise<Cart> {
    const dbCart = await this.prismaService.cart.update({
      where: { id },
      data: {
        quantity: updateDto.quantity !== undefined ? Number(updateDto.quantity) : undefined,
        note: updateDto.note !== undefined ? updateDto.note : undefined
      },
      include: {
        product: true
      }
    })
    return mapCart(dbCart)
  }

  async deleteCartItem(id: string): Promise<Cart> {
    const dbCart = await this.prismaService.cart.delete({
      where: { id },
      include: {
        product: true
      }
    })
    return mapCart(dbCart)
  }

  async clearTableCart(tableId: string): Promise<number> {
    const result = await this.prismaService.cart.deleteMany({
      where: { tableId }
    })
    return result.count
  }
}
