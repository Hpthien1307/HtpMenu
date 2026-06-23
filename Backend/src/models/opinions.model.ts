export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export class Opinion {
  id: string
  gender: Gender
  birthYear: number
  content: string
  isRead: boolean
  createdAt: Date
  constructor({ id, gender, birthYear, content, isRead, createdAt }: Partial<Opinion> = {}) {
    if (id !== undefined && id !== null) this.id = id
    if (gender !== undefined && gender !== null) this.gender = gender
    if (birthYear !== undefined && birthYear !== null) this.birthYear = birthYear
    if (content !== undefined && content !== null) this.content = content
    if (isRead !== undefined && isRead !== null) this.isRead = isRead
    if (createdAt !== undefined && createdAt !== null) this.createdAt = createdAt
  }
}
