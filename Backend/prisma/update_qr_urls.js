const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
  console.log(`Updating all table QR codes to point to: ${frontendUrl}`)

  const tables = await prisma.table.findMany()
  for (const table of tables) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${frontendUrl}/?tableId=${table.id}`
    await prisma.table.update({
      where: { id: table.id },
      data: { qrCodeUrl }
    })
    console.log(`Updated Table: ${table.tableNumber} | QR: ${qrCodeUrl}`)
  }
  console.log("Finished updating table QR codes!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
