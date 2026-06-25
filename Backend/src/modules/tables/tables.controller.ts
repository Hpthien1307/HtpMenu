import { Controller, Get, Post, Param, Body } from "@nestjs/common"
import { TablesService } from "./tables.service"
import { ResponseData } from "../../global/globalClass"
import { HttpMessage, HttpStatus } from "../../global/globalEnum"

@Controller("tables")
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  async getAllTables() {
    try {
      const data = await this.tablesService.getAllTables()
      return new ResponseData(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error: any) {
      console.error("Error getting all tables", error)
      return new ResponseData(null, HttpStatus.INTERNAL_SERVER_ERROR, error.message || HttpMessage.NOT_FOUND)
    }
  }

  @Get(":id")
  async getTableDetail(@Param("id") id: string) {
    try {
      const data = await this.tablesService.getTableDetail(id)
      return new ResponseData(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error: any) {
      console.error("Error getting table detail", error)
      return new ResponseData(null, HttpStatus.NOT_FOUND, error.message || HttpMessage.NOT_FOUND)
    }
  }

  @Post()
  async createTable(@Body("tableNumber") tableNumber: string) {
    try {
      const data = await this.tablesService.createTable(tableNumber)
      return new ResponseData(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error: any) {
      console.error("Error creating table", error)
      return new ResponseData(null, HttpStatus.BAD_REQUEST, error.message || HttpMessage.BAD_REQUEST)
    }
  }
}
