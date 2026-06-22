import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import { OrderService } from "@/modules/orders/orders.service"
import { Order } from "@/models/orders.model"
import { HttpMessage } from "@/global/globalEnum"
import { HttpStatus } from "@/global/globalEnum"
import { ResponseData } from "@/global/globalClass"

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders(): Promise<ResponseData<Order[]>> {
    try {
      const data = await this.orderService.getOrders()
      return new ResponseData<Order[]>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.log("Error get orders", error)
      return new ResponseData(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Post()
  async createOrder(@Body() order: any): Promise<ResponseData<Order>> {
    try {
      const data = await this.orderService.createOrder(order)
      return new ResponseData<Order>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.log("Error create order", error)
      return new ResponseData<Order>(null, HttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST)
    }
  }

  @Get(":id")
  async getOrderDetail(@Param("id") id: string): Promise<ResponseData<Order>> {
    try {
      const data = await this.orderService.getOrderDetail(id)
      return new ResponseData<Order>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.log("Error get order detail", error)
      return new ResponseData<Order>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Put(":id")
  async updateOrder(@Param("id") id: string, @Body() order: Partial<Order>): Promise<ResponseData<Order>> {
    try {
      const data = await this.orderService.updateOrder(id, order)
      return new ResponseData<Order>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.log("Error update order", error)
      return new ResponseData<Order>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Delete(":id")
  async deleteOrder(@Param("id") id: string): Promise<ResponseData<Order>> {
    try {
      const data = await this.orderService.deleteOrder(id)
      return new ResponseData<Order>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.log("Error delete order", error)
      return new ResponseData<Order>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }
}
