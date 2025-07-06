import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Owner } from 'generated/prisma';

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OwnerCreateInput): Promise<Owner> {
    return this.prisma.owner.create({ data });
  }

  async getAll(params: {
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const owners = await this.prisma.owner.findMany({
      skip,
      take: limit,
    });
    const totalOwners = await this.prisma.owner.count();
    const hasNextPage = skip + owners.length < totalOwners;

    return {
        data: owners,
        page,
        limit,
        next: hasNextPage
    };
  }

  async getById(id: string): Promise<Owner> {
    const owner = await this.prisma.owner.findUnique({ where: { id } });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }
    return owner;
  }

  async update(id: string, data: Prisma.OwnerUpdateInput): Promise<Owner> {
    return this.prisma.owner.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Owner> {
    return this.prisma.owner.delete({ where: { id } });
  }
}
