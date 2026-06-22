import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { CategoriesService } from "@/modules/categories/categories.service";
import { ResponseData } from "@/global/globalClass";
import { HttpMessage, HttpStatus } from "@/global/globalEnum";
import { Category } from "@/models/products.model";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<ResponseData<Category[]>> {
    try {
      const data = await this.categoriesService.getCategories();
      return new ResponseData<Category[]>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error getting all categories", error);
      return new ResponseData<Category[]>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND);
    }
  }

  @Post()
  async createCategory(@Body() category: Category): Promise<ResponseData<Category>> {
    try {
      const data = await this.categoriesService.createCategory(category);
      return new ResponseData<Category>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error creating category", error);
      return new ResponseData<Category>(null, HttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST);
    }
  }

  @Get("/:id")
  async getDetailCategory(@Param("id") id: string): Promise<ResponseData<Category>> {
    try {
      const data = await this.categoriesService.getDetailCategory(id);
      return new ResponseData<Category>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error getting detail category", error);
      return new ResponseData<Category>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND);
    }
  }

  @Put("/:id")
  async updateCategory(
    @Param("id") id: string,
    @Body() category: Partial<Category>
  ): Promise<ResponseData<Category>> {
    try {
      const data = await this.categoriesService.updateCategory(id, category);
      return new ResponseData<Category>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error updating category", error);
      return new ResponseData<Category>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND);
    }
  }

  @Delete("/:id")
  async deleteCategory(@Param("id") id: string): Promise<ResponseData<Category>> {
    try {
      const data = await this.categoriesService.deleteCategory(id);
      return new ResponseData<Category>(
        data,
        HttpStatus.OK,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error("Error deleting category", error);
      return new ResponseData<Category>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND);
    }
  }
}
