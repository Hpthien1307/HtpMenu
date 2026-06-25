import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import { CartService } from "./cart.service"
import { ResponseData } from "../../global/globalClass"
import { HttpMessage, HttpStatus } from "../../global/globalEnum"
import { Cart } from "../../models/cart.model"
import { CartDto, UpdateCartDto } from "../../dto/cart.dto"

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get("table/:tableId")
  async getCartByTable(@Param("tableId") tableId: string): Promise<ResponseData<Cart[]>> {
    try {
      const data = await this.cartService.getCartByTable(tableId)
      return new ResponseData<Cart[]>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error getting cart for table", error)
      return new ResponseData<Cart[]>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Post()
  async addToCart(@Body() cartDto: CartDto): Promise<ResponseData<Cart>> {
    try {
      const data = await this.cartService.addToCart(cartDto)
      return new ResponseData<Cart>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error adding to cart", error)
      return new ResponseData<Cart>(null, HttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST)
    }
  }

  @Put("/:id")
  async updateCartItem(@Param("id") id: string, @Body() updateDto: UpdateCartDto): Promise<ResponseData<Cart>> {
    try {
      const data = await this.cartService.updateCartItem(id, updateDto)
      return new ResponseData<Cart>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error updating cart item", error)
      return new ResponseData<Cart>(null, HttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST)
    }
  }

  @Delete("/:id")
  async deleteCartItem(@Param("id") id: string): Promise<ResponseData<Cart>> {
    try {
      const data = await this.cartService.deleteCartItem(id)
      return new ResponseData<Cart>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error deleting cart item", error)
      return new ResponseData<Cart>(null, HttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST)
    }
  }

  @Delete("/table/:tableId")
  async clearTableCart(@Param("tableId") tableId: string): Promise<ResponseData<number>> {
    try {
      const count = await this.cartService.clearTableCart(tableId)
      return new ResponseData<number>(count, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error clearing table cart", error)
      return new ResponseData<number>(null, HttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST)
    }
  }
}
