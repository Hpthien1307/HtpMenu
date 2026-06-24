const { PrismaClient } = require("@prisma/client")
const fs = require("fs")
const path = require("path")

const prisma = new PrismaClient()

async function main() {
  console.log("1. Enabling pgcrypto extension...")
  await prisma.$executeRawUnsafe("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
  
  console.log("2. Executing SQL to create uuid_generate_v7 function...")
  const sql = fs.readFileSync(path.join(__dirname, "uuidv7.sql"), "utf8")
  await prisma.$executeRawUnsafe(sql)
  
  console.log("Function created successfully!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
