const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  console.log("Seeding tables...")

  // Delete existing tables to avoid unique constraint error on tableNumber
  await prisma.table.deleteMany()

  const tableNumbers = ["1", "2", "3", "4", "5", "10"]
  
  for (const num of tableNumbers) {
    // 1. Create table with placeholder QR code URL to get its ID
    const table = await prisma.table.create({
      data: {
        tableNumber: `Bàn ${num}`,
        qrCodeUrl: "temp"
      }
    })

    // 2. Generate actual QR code URL referencing the table's UUID
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=http://localhost:5173/?tableId=${table.id}`

    // 3. Update the table with the QR code URL
    await prisma.table.update({
      where: { id: table.id },
      data: { qrCodeUrl }
    })

    console.log(`Created Table: Bàn ${num} | ID: ${table.id} | QR Code URL: ${qrCodeUrl}`)
  }

  console.log("Finished seeding tables!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
