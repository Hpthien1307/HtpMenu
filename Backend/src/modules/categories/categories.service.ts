import { Category } from "../../models/products.model"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service"
import { CategoryDto } from "../../dto/categories.dto"

function mapCategory(dbCategory: any): Category {
  return {
    id: dbCategory.id,
    categoryName: dbCategory.name,
    isActive: true // Default to true since schema.prisma Category does not have isActive
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
      where: { id }
    })
    if (!category) {
      throw new Error(`Category with id ${id} not found`)
    }
    return mapCategory(category)
  }

  async createCategory(categoryDto: CategoryDto): Promise<Category> {
    const dbCategory = await this.prismaService.category.create({
      data: {
        name: categoryDto.categoryName
      }
    })
    return mapCategory(dbCategory)
  }

  async createManyCategory(categoryDto: CategoryDto[]): Promise<Category[]> {
    const createdCategory = await this.prismaService.$transaction(
      categoryDto.map(dto =>
        this.prismaService.category.create({
          data: {
            name: dto.categoryName
          }
        })
      )
    )
    return createdCategory.map(mapCategory)
  }

  async updateCategory(id: string, updatedData: Partial<Category>): Promise<Category> {
    const dbCategory = await this.prismaService.category.update({
      where: { id },
      data: {
        name: updatedData.categoryName
      }
    })
    return mapCategory(dbCategory)
  }

  async deleteCategory(id: string): Promise<Category> {
    const dbCategory = await this.prismaService.category.delete({
      where: { id }
    })
    return mapCategory(dbCategory)
  }
}
