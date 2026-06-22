import { ProductDto } from "@/dto/product.dto"
import { Product } from "@/models/products.model"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/prisma/prisma.service"

// Helper function to map database record to Product model
function mapProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    isActive: dbProduct.isAvailable,
    categoryId: dbProduct.categoryId,
    thumbnail: dbProduct.thumbnail,
    productName: dbProduct.name,
    price: dbProduct.price
  }
}

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProducts(): Promise<Product[]> {
    const products = await this.prismaService.product.findMany()
    return products.map(mapProduct)
  }

  async createProduct(productDto: ProductDto): Promise<Product> {
    const product = await this.prismaService.product.create({
      data: {
        name: productDto.productName,
        thumbnail: productDto.thumbnail || "",
        price: productDto.price || 0,
        isAvailable: productDto.isActive !== undefined ? productDto.isActive : true,
        categoryId: productDto.categoryId
      }
    })
    return mapProduct(product)
  }

  async getDetailProduct(id: string): Promise<Product> {
    const product = await this.prismaService.product.findUnique({
      where: { id }
    })
    if (!product) {
      throw new Error(`Product with id ${id} not found`)
    }
    return mapProduct(product)
  }

  async updateProduct(productDto: ProductDto, id: string): Promise<Product> {
    const product = await this.prismaService.product.update({
      where: { id },
      data: {
        name: productDto.productName,
        thumbnail: productDto.thumbnail,
        price: productDto.price,
        isAvailable: productDto.isActive,
        categoryId: productDto.categoryId
      }
    })
    return mapProduct(product)
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.prismaService.product.delete({
        where: { id }
      })
      return true
    } catch (error) {
      console.log("lỗi delete", error)
      return false
    }
  }
}
