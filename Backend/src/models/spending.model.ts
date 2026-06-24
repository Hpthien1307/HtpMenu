export class Spending {
  id?: string
  title?: string
  image?: string
  tag?: string
  price?: number
  amount?: number
  createdAt?: Date

  constructor(data: Partial<Spending> = {}) {
    Object.assign(this, data)
  }
}

