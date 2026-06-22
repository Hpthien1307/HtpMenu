import { Opinion, Gender } from "@/models/opinions.model";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class OpinionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOpinions(): Promise<Opinion[]> {
    const dbOpinions = await this.prismaService.opinion.findMany();
    return dbOpinions.map((dbOpinion) => new Opinion({
      id: dbOpinion.id,
      gender: dbOpinion.gender as Gender,
      birthYear: dbOpinion.birthYear,
      content: dbOpinion.content,
      isRead: dbOpinion.isRead,
      createdAt: dbOpinion.createdAt,
    }));
  }

  async getDetailOpinion(id: string): Promise<Opinion> {
    const dbOpinion = await this.prismaService.opinion.findUnique({
      where: { id },
    });
    if (!dbOpinion) {
      throw new Error(`Opinion with id ${id} not found`);
    }
    return new Opinion({
      id: dbOpinion.id,
      gender: dbOpinion.gender as Gender,
      birthYear: dbOpinion.birthYear,
      content: dbOpinion.content,
      isRead: dbOpinion.isRead,
      createdAt: dbOpinion.createdAt,
    });
  }

  async createOpinion(opinionData: any): Promise<Opinion> {
    const dbOpinion = await this.prismaService.opinion.create({
      data: {
        gender: opinionData.gender || Gender.OTHER,
        birthYear: Number(opinionData.birthYear),
        content: opinionData.content,
        isRead: opinionData.isRead !== undefined ? opinionData.isRead : false,
        createdAt: opinionData.createdAt ? new Date(opinionData.createdAt) : new Date(),
      },
    });
    return new Opinion({
      id: dbOpinion.id,
      gender: dbOpinion.gender as Gender,
      birthYear: dbOpinion.birthYear,
      content: dbOpinion.content,
      isRead: dbOpinion.isRead,
      createdAt: dbOpinion.createdAt,
    });
  }

  async updateOpinion(id: string, updatedData: Partial<Opinion>): Promise<Opinion> {
    const dbOpinion = await this.prismaService.opinion.update({
      where: { id },
      data: {
        gender: updatedData.gender,
        birthYear: updatedData.birthYear !== undefined ? Number(updatedData.birthYear) : undefined,
        content: updatedData.content,
        isRead: updatedData.isRead,
        createdAt: updatedData.createdAt ? new Date(updatedData.createdAt) : undefined,
      },
    });
    return new Opinion({
      id: dbOpinion.id,
      gender: dbOpinion.gender as Gender,
      birthYear: dbOpinion.birthYear,
      content: dbOpinion.content,
      isRead: dbOpinion.isRead,
      createdAt: dbOpinion.createdAt,
    });
  }

  async deleteOpinion(id: string): Promise<Opinion> {
    const dbOpinion = await this.prismaService.opinion.delete({
      where: { id },
    });
    return new Opinion({
      id: dbOpinion.id,
      gender: dbOpinion.gender as Gender,
      birthYear: dbOpinion.birthYear,
      content: dbOpinion.content,
      isRead: dbOpinion.isRead,
      createdAt: dbOpinion.createdAt,
    });
  }
}
