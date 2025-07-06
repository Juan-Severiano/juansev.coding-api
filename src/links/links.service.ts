import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Links } from 'generated/prisma';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LinksCreateInput): Promise<Links> {
    return this.prisma.links.create({ data });
  }

  async getAll(params: {
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const links = await this.prisma.links.findMany({
      skip,
      take: limit,
    });
    const totalLinks = await this.prisma.links.count();
    const hasNextPage = skip + links.length < totalLinks;

    return {
        data: links,
        page,
        limit,
        next: hasNextPage
    };
  }

  async getById(id: string): Promise<Links> {
    const link = await this.prisma.links.findUnique({ where: { id } });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    return link;
  }

  async update(id: string, data: Prisma.LinksUpdateInput): Promise<Links> {
    return this.prisma.links.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Links> {
    return this.prisma.links.delete({ where: { id } });
  }
}
