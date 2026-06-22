import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data to avoid conflicts
  await prisma.opinion.deleteMany({})
  await prisma.spending.deleteMany({})
  await prisma.comboItem.deleteMany({})
  await prisma.combo.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.table.deleteMany({})
  await prisma.employee.deleteMany({})

  console.log("Seeding database with custom categories...")

  // 1. Seed Categories
  // const catCombo = await prisma.category.create({ data: { name: "COMBO" } })
  const catGaRan = await prisma.category.create({ data: { name: "GÀ RÁN" } })
  const catXotGaRan = await prisma.category.create({ data: { name: "XỐT GÀ RÁN" } })
  const catMyCay = await prisma.category.create({ data: { name: "MỲ CAY" } })
  const catToppingMyCay = await prisma.category.create({ data: { name: "TOPPING MÌ CAY" } })
  const catComCanhLau = await prisma.category.create({ data: { name: "CƠM CANH LẨU" } })
  const catAnVat = await prisma.category.create({ data: { name: "ĂN VẶT" } })
  const catDoUong = await prisma.category.create({ data: { name: "ĐỒ UỐNG" } })

  // 2. Seed Employees
  await prisma.employee.create({
    data: {
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      position: "Quản lý",
      salary: 15000000
    }
  })
  await prisma.employee.create({
    data: {
      name: "Trần Thị B",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      position: "Đầu bếp chính",
      salary: 12000000
    }
  })

  // 3. Seed Tables
  await prisma.table.create({
    data: {
      tableNumber: "01",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Table01",
      status: "AVAILABLE"
    }
  })
  await prisma.table.create({
    data: {
      tableNumber: "02",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Table02",
      status: "AVAILABLE"
    }
  })

  // 4. Seed Products for the categories
  // GÀ RÁN
  await prisma.product.create({
    data: {
      name: "Cánh gà chiên giòn",
      thumbnail: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec",
      price: 35000,
      isAvailable: true,
      categoryId: catGaRan.id
    }
  })
  await prisma.product.create({
    data: {
      name: "Đùi gà truyền thống",
      thumbnail: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
      price: 40000,
      isAvailable: true,
      categoryId: catGaRan.id
    }
  })

  // XỐT GÀ RÁN
  await prisma.product.create({
    data: {
      name: "Xốt cay Hàn Quốc",
      thumbnail: "https://images.unsplash.com/photo-1608756687911-a1e59f63595f",
      price: 5000,
      isAvailable: true,
      categoryId: catXotGaRan.id
    }
  })

  // MỲ CAY
  await prisma.product.create({
    data: {
      name: "Mì cay hải sản cấp độ 2",
      thumbnail: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
      price: 59000,
      isAvailable: true,
      categoryId: catMyCay.id
    }
  })

  // TOPPING MÌ CAY
  await prisma.product.create({
    data: {
      name: "Xúc xích thêm",
      thumbnail: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
      price: 10000,
      isAvailable: true,
      categoryId: catToppingMyCay.id
    }
  })

  // CƠM CANH LẨU
  await prisma.product.create({
    data: {
      name: "Cơm trộn gà nướng",
      thumbnail: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
      price: 49000,
      isAvailable: true,
      categoryId: catComCanhLau.id
    }
  })

  // ĂN VẶT
  await prisma.product.create({
    data: {
      name: "Khoai tây chiên",
      thumbnail: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
      price: 25000,
      isAvailable: true,
      categoryId: catAnVat.id
    }
  })

  // ĐỒ UỐNG
  await prisma.product.create({
    data: {
      name: "Trà đào cam sả",
      thumbnail: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
      price: 29000,
      isAvailable: true,
      categoryId: catDoUong.id
    }
  })

  // 5. Seed Spending
  await prisma.spending.createMany({
    data: [
      {
        title: "Mua nguyên liệu đầu vào",
        tag: "Nhập hàng",
        amount: 2500000
      }
    ]
  })

  // 6. Seed Opinions
  await prisma.opinion.createMany({
    data: [
      {
        gender: "MALE",
        birthYear: 1995,
        content: "Món ăn ngon và phục vụ rất nhanh!",
        isRead: false
      }
    ]
  })

  console.log("Database seeding completed successfully!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
