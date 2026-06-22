import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import { ProductService } from "@/modules/products/product.service"
import { ResponseData } from "@/global/globalClass"
import { HttpMessage, HttpStatus } from "@/global/globalEnum"
import { Product } from "@/models/products.model"
import { ProductDto } from "@/dto/product.dto"

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(): Promise<ResponseData<Product[]>> {
    try {
      const data = await this.productService.getProducts()
      return new ResponseData<Product[]>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error getting all products", error)
      return new ResponseData<Product[]>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Post()
  async createProduct(@Body() productDto: ProductDto): Promise<ResponseData<Product>> {
    try {
      const data = await this.productService.createProduct(productDto)
      return new ResponseData<Product>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error creating product", error)
      return new ResponseData<Product>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Get("/:id")
  async getDetailProduct(@Param("id") id: string): Promise<ResponseData<Product>> {
    try {
      const data = await this.productService.getDetailProduct(id)
      return new ResponseData<Product>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error getting detail product", error)
      return new ResponseData<Product>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Put("/:id")
  async updateProduct(@Body() productDto: ProductDto, @Param("id") id: string): Promise<ResponseData<Product>> {
    try {
      const data = await this.productService.updateProduct(productDto, id)
      return new ResponseData<Product>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error updating product", error)
      return new ResponseData<Product>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Delete("/:id")
  async deleteProduct(@Param("id") id: string): Promise<ResponseData<boolean>> {
    try {
      const success = await this.productService.deleteProduct(id)
      return new ResponseData<boolean>(success, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error deleting product", error)
      return new ResponseData<boolean>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }
}
