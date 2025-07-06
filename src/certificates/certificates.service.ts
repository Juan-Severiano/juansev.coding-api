import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Certificates } from 'generated/prisma';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CertificatesCreateInput): Promise<Certificates> {
    return this.prisma.certificates.create({ data });
  }

  async getAll(params: {
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const certificates = await this.prisma.certificates.findMany({
      skip,
      take: limit,
    });
    const totalCertificates = await this.prisma.certificates.count();
    const hasNextPage = skip + certificates.length < totalCertificates;

    return {
        data: certificates,
        page,
        limit,
        next: hasNextPage
    };
  }

  async getById(id: string): Promise<Certificates> {
    const certificate = await this.prisma.certificates.findUnique({ where: { id } });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return certificate;
  }

  async update(id: string, data: Prisma.CertificatesUpdateInput): Promise<Certificates> {
    return this.prisma.certificates.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Certificates> {
    return this.prisma.certificates.delete({ where: { id } });
  }
}
