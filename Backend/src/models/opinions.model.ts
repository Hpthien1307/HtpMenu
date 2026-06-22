export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class Opinion {
  id: string;
  gender: Gender;
  birthYear: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
  constructor({id, gender, birthYear, content, isRead, createdAt}){
    if(id !== null) this.id = id;
    if(gender !== null) this.gender = gender;
    if(birthYear !== null) this.birthYear = birthYear;
    if(content !== null) this.content = content;
    if(isRead !== null) this.isRead = isRead;
    if(createdAt !== null) this.createdAt = createdAt;
  }
}