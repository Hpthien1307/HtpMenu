import { Controller, Get, Post, Put, Delete, HttpStatus, Param, Body } from "@nestjs/common"
import { SpendingService } from "@/modules/spending/spending.service"
import { Spending } from "@/models/spending.model"
import { ResponseData } from "@/global/globalClass"
import { HttpMessage } from "@/global/globalEnum"

@Controller("spendings")
export class SpendingContollers {
  constructor(private readonly spendingService: SpendingService) {}

  @Get()
  async getSpending(): Promise<ResponseData<Spending[]>> {
    try {
      const data = await this.spendingService.getSpending()
      return new ResponseData<Spending[]>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error getting all spending", error)
      return new ResponseData<Spending[]>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Get("/:id")
  async getSpendingDetail(@Param("id") id: string): Promise<ResponseData<Spending>> {
    try {
      const data = await this.spendingService.getSpendingDetail(id)
      return new ResponseData<Spending>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error getting detail spending", error)
      return new ResponseData<Spending>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Post()
  async addSpending(@Body() spending: Spending): Promise<ResponseData<Spending>> {
    try {
      const data = await this.spendingService.addSpending(spending)
      return new ResponseData<Spending>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error adding spending", error)
      return new ResponseData<Spending>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Put("/:id")
  async updateSpending(@Param("id") id: string, @Body() spending: Partial<Spending>): Promise<ResponseData<Spending>> {
    try {
      const data = await this.spendingService.updateSpending(id, spending)
      return new ResponseData<Spending>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error updating spending", error)
      return new ResponseData<Spending>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Delete("/:id")
  async deleteSpending(@Param("id") id: string): Promise<ResponseData<Spending>> {
    try {
      const data = await this.spendingService.deleteSpending(id)
      return new ResponseData<Spending>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error deleting spending", error)
      return new ResponseData<Spending>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }
}
