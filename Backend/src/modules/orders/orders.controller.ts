import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import { OrderService } from "@/modules/orders/orders.service"
import { Order } from "@/models/orders.model"
import { HttpMessage } from "@/global/globalEnum"
import { HttpStatus } from "@/global/globalEnum"
import { ResponseData } from "@/global/globalClass"
import { OrderDto } from "@/dto/orders.dto"

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
  async createOrder(@Body() orderDto: OrderDto): Promise<ResponseData<Order>> {
    try {
      const data = await this.orderService.createOrder(orderDto)
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
  async updateOrder(@Param("id") id: string, @Body() orderDto: Partial<OrderDto>): Promise<ResponseData<Order>> {
    try {
      const data = await this.orderService.updateOrder(id, orderDto)
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
