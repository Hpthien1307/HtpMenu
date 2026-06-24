export class Category {
  id?: string
  categoryName?: string
  isActive?: boolean

  constructor(data: Partial<Category> = {}) {
    Object.assign(this, data)
  }
}

export class Product {
  id?: string
  isActive?: boolean
  categoryId?: string
  thumbnail?: string
  productName?: string
  price?: number

  constructor(data: Partial<Product> = {}) {
    Object.assign(this, data)
  }
}

export class Combo {
  id?: string
  comboName?: string
  price?: number
  thumbnail?: string
  isActive?: boolean
  items?: ComboItem[]

  constructor(data: Partial<Combo> = {}) {
    Object.assign(this, data)
  }
}

export class ComboItem {
  id?: string
  comboId?: string
  productId?: string
  quantity?: number

  constructor(data: Partial<ComboItem> = {}) {
    Object.assign(this, data)
  }
}
