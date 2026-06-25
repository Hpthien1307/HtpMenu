import { ProductDto } from "../../dto/product.dto"
import { Product } from "../../models/products.model"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service"
import { SearchDto } from "../../dto/search.dto"

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

  async getCombos(): Promise<any[]> {
    const combos = await this.prismaService.combo.findMany({
      include: {
        comboItems: {
          include: {
            product: true
          }
        }
      }
    })
    return combos.map(dbCombo => ({
      id: dbCombo.id,
      comboName: dbCombo.name,
      price: dbCombo.price,
      thumbnail: dbCombo.thumbnail,
      isActive: dbCombo.isActive,
      items: dbCombo.comboItems.map(item => ({
        id: item.id,
        comboId: item.comboId,
        productId: item.productId,
        quantity: item.quantity,
        productName: item.product.name,
        productPrice: item.product.price,
        productThumbnail: item.product.thumbnail
      }))
    }))
  }

  async getSearchProducts(query: SearchDto): Promise<Product[]> {
    const { keyword, categories } = query
    const where: any = {}

    // Logic 1: Lọc theo tên sản phẩm gần đúng (không phân biệt chữ hoa/thường)
    if (keyword) {
      where.name = {
        contains: keyword,
        mode: "insensitive"
      }
    }

    // Logic 2: Lọc theo danh mục sản phẩm
    if (categories) {
      where.categoryId = categories
    }

    const dbProducts = await this.prismaService.product.findMany({
      where
    })

    // Trả kết quả cuối cùng về cho Controller sau khi map sang model Product
    return dbProducts.map(mapProduct)
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

  async createManyProducts(productDtos: ProductDto[]): Promise<Product[]> {
    const createdProducts = await this.prismaService.$transaction(
      productDtos.map(dto =>
        this.prismaService.product.create({
          data: {
            name: dto.productName,
            thumbnail: dto.thumbnail || "",
            price: dto.price || 0,
            isAvailable: dto.isActive !== undefined ? dto.isActive : true,
            categoryId: dto.categoryId
          }
        })
      )
    )
    return createdProducts.map(mapProduct)
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
