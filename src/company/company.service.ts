import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Company } from 'generated/prisma';
import { CreateCompanyDto } from './dto/create';
import { UpdateCompanyDto } from './dto/update';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateCompanyDto,
    photo: Express.Multer.File,
  ): Promise<Company> {
    return this.prisma.$transaction(async (prisma) => {
      const attach = await prisma.attach.create({
        data: {
          path: photo.filename,
          type: photo.mimetype,
        },
      });

      return prisma.company.create({
        data: {
          ...data,
          photoId: attach.id,
        },
      });
    });
  }

  async getAll(params: {
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const companies = await this.prisma.company.findMany({
      skip,
      take: limit,
    });
    const totalCompanies = await this.prisma.company.count();
    const hasNextPage = skip + companies.length < totalCompanies;

    return {
        data: companies,
        page,
        limit,
        next: hasNextPage
    };
  }

  async getById(id: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: string, data: UpdateCompanyDto): Promise<Company> {
    return this.prisma.company.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Company> {
    return this.prisma.company.delete({ where: { id } });
  }
}
