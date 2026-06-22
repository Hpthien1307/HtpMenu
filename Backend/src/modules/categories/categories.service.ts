import { Category } from "@/models/products.model"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/prisma/prisma.service"

function mapCategory(dbCategory: any): Category {
  return {
    id: dbCategory.id,
    categoryName: dbCategory.name,
    isActive: true, // Default to true since schema.prisma Category does not have isActive
  }
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCategories(): Promise<Category[]> {
    const categories = await this.prismaService.category.findMany()
    return categories.map(mapCategory)
  }

  async getDetailCategory(id: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    })
    if (!category) {
      throw new Error(`Category with id ${id} not found`)
    }
    return mapCategory(category)
  }

  async createCategory(category: Category): Promise<Category> {
    const dbCategory = await this.prismaService.category.create({
      data: {
        name: category.categoryName,
      },
    })
    return mapCategory(dbCategory)
  }

  async updateCategory(id: string, updatedData: Partial<Category>): Promise<Category> {
    const dbCategory = await this.prismaService.category.update({
      where: { id },
      data: {
        name: updatedData.categoryName,
      },
    })
    return mapCategory(dbCategory)
  }

  async deleteCategory(id: string): Promise<Category> {
    const dbCategory = await this.prismaService.category.delete({
      where: { id },
    })
    return mapCategory(dbCategory)
  }
}
