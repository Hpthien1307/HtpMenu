import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import { OpinionsService } from "../../modules/opinions/opinions.service"
import { ResponseData } from "../../global/globalClass"
import { HttpMessage, HttpStatus } from "../../global/globalEnum"
import { Opinion } from "../../models/opinions.model"
import { OpinionsDto } from "../../dto/opinions.dto"

@Controller("opinions")
export class OpinionsController {
  constructor(private readonly opinionsService: OpinionsService) {}

  @Get()
  async getOpinions(): Promise<ResponseData<Opinion[]>> {
    try {
      const data = await this.opinionsService.getOpinions()
      return new ResponseData<Opinion[]>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error getting all opinions", error)
      return new ResponseData<Opinion[]>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Post()
  async createOpinion(@Body() opinionsDto: OpinionsDto): Promise<ResponseData<Opinion>> {
    try {
      const data = await this.opinionsService.createOpinion(opinionsDto)
      return new ResponseData<Opinion>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.log("Error creating opinion", error)
      return new ResponseData<Opinion>(null, HttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST)
    }
  }

  @Get("/:id")
  async getDetailOpinion(@Param("id") id: string): Promise<ResponseData<Opinion>> {
    try {
      const data = await this.opinionsService.getDetailOpinion(id)
      return new ResponseData<Opinion>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error getting detail opinion", error)
      return new ResponseData<Opinion>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Put("/:id")
  async updateOpinion(@Param("id") id: string, @Body() opinion: Partial<Opinion>): Promise<ResponseData<Opinion>> {
    try {
      const data = await this.opinionsService.updateOpinion(id, opinion)
      return new ResponseData<Opinion>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error updating opinion", error)
      return new ResponseData<Opinion>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }

  @Delete("/:id")
  async deleteOpinion(@Param("id") id: string): Promise<ResponseData<Opinion>> {
    try {
      const data = await this.opinionsService.deleteOpinion(id)
      return new ResponseData<Opinion>(data, HttpStatus.OK, HttpMessage.SUCCESS)
    } catch (error) {
      console.error("Error deleting opinion", error)
      return new ResponseData<Opinion>(null, HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND)
    }
  }
}
