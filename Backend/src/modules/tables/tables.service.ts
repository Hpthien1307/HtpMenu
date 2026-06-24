import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/prisma/prisma.service"

@Injectable()
export class TablesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllTables() {
    return this.prismaService.table.findMany({
      orderBy: {
        tableNumber: "asc"
      }
    })
  }

  async getTableDetail(id: string) {
    const table = await this.prismaService.table.findUnique({
      where: { id }
    })
    if (!table) {
      throw new Error(`Table with id ${id} not found`)
    }
    return table
  }

  async createTable(tableNumber: string) {
    // We will generate the UUID first so we can include it in the QR code URL
    // Since we don't have uuidv7 library helper here easily or we can let prisma do it,
    // let's create the record first, then update its QR code URL.
    const table = await this.prismaService.table.create({
      data: {
        tableNumber,
        qrCodeUrl: "" // Will be updated
      }
    })

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=http://localhost:5173/?tableId=${table.id}`
    
    return this.prismaService.table.update({
      where: { id: table.id },
      data: { qrCodeUrl }
    })
  }
}
