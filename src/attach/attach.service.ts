import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Attach } from 'generated/prisma';

@Injectable()
export class AttachService {
  constructor(private prisma: PrismaService) {}

  async create(file: Express.Multer.File): Promise<Attach> {
    const { originalname, filename, path, mimetype } = file;
    return this.prisma.attach.create({
      data: {
        path: filename,
        type: mimetype,
      },
    });
  }

  async getAll(params: {
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const attaches = await this.prisma.attach.findMany({
      skip,
      take: limit,
    });
    const totalAttaches = await this.prisma.attach.count();
    const hasNextPage = skip + attaches.length < totalAttaches;

    return {
        data: attaches,
        page,
        limit,
        next: hasNextPage
    };
  }

  async getById(id: string): Promise<Attach> {
    const attach = await this.prisma.attach.findUnique({ where: { id } });
    if (!attach) {
      throw new NotFoundException('Attach not found');
    }
    return attach;
  }

  async delete(id: string): Promise<Attach> {
    return this.prisma.attach.delete({ where: { id } });
  }
}
