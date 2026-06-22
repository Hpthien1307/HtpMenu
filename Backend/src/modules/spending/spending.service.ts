import { Spending } from "@/models/spending.model"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/prisma/prisma.service"

function mapSpending(dbSpending: any): Spending {
  return {
    id: dbSpending.id,
    title: dbSpending.title,
    image: dbSpending.image ?? "",
    tag: dbSpending.tag,
    price: dbSpending.amount,
    amount: 1,
    createdAt: dbSpending.createdAt
  }
}

@Injectable()
export class SpendingService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSpending(): Promise<Spending[]> {
    const dbSpendings = await this.prismaService.spending.findMany()
    return dbSpendings.map(mapSpending)
  }

  async getSpendingDetail(id: string): Promise<Spending> {
    const dbSpending = await this.prismaService.spending.findUnique({
      where: { id }
    })
    if (!dbSpending) {
      throw new Error(`Spending with id ${id} not found`)
    }
    return mapSpending(dbSpending)
  }

  async addSpending(spending: Spending): Promise<Spending> {
    const dbSpending = await this.prismaService.spending.create({
      data: {
        title: spending.title,
        image: spending.image || "",
        tag: spending.tag,
        amount: Number(spending.price)
      }
    })
    return mapSpending(dbSpending)
  }

  async updateSpending(id: string, updatedData: Partial<Spending>): Promise<Spending> {
    const dbSpending = await this.prismaService.spending.update({
      where: { id },
      data: {
        title: updatedData.title,
        image: updatedData.image,
        tag: updatedData.tag,
        amount: updatedData.price !== undefined ? Number(updatedData.price) : undefined
      }
    })
    return mapSpending(dbSpending)
  }

  async deleteSpending(id: string): Promise<Spending> {
    const dbSpending = await this.prismaService.spending.delete({
      where: { id }
    })
    return mapSpending(dbSpending)
  }
}
