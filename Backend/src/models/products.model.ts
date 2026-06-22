export class Category {
  id: string
  categoryName: string
  isActive: boolean
}

export class Product {
  id: string
  isActive?: boolean
  categoryId?: string
  thumbnail?: string
  productName?: string
  price?: number
}

export class Combo {
  id: number
  comboName: string
  price: number
  thumbnail: string
  isActive: boolean
  items: ComboItem[]
}

export class ComboItem {
  id: number
  comboId: string
  productId: string
  quantity: number
}
