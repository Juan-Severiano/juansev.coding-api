import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Project } from 'generated/prisma';
import { CreateProjectDto } from './dto/create';
import { UpdateProjectDto } from './dto/update';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  private async generateSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    let slug = baseSlug;
    let counter = 1;
    while (await this.prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  async create(
    data: CreateProjectDto,
    files: { cover?: Express.Multer.File[], photo?: Express.Multer.File[], images?: Express.Multer.File[] },
  ): Promise<Project> {
    return this.prisma.$transaction(async (prisma) => {
      const { links, ...projectData } = data;
      const slug = await this.generateSlug(projectData.name);
      if (!files.cover || !files.photo || !files.images) {
        throw new BadRequestException()
      }
      const coverAttach = await prisma.attach.create({
        data: {
          path: files.cover[0].filename,
          type: files.cover[0].mimetype,
        },
      });

      const photoAttach = await prisma.attach.create({
        data: {
          path: files.photo[0].filename,
          type: files.photo[0].mimetype,
        },
      });

      const imageAttaches = await Promise.all(
        files.images.map((image) =>
          prisma.attach.create({
            data: {
              path: image.filename,
              type: image.mimetype,
            },
          }),
        ),
      );

      const linksCreation = await prisma.links.create({ data: links })

      return prisma.project.create({
        data: {
          ...projectData,
          slug,
          linksId: linksCreation.id,
          coverId: coverAttach.id,
          photoId: photoAttach.id,
          images: {
            connect: imageAttaches.map((attach) => ({ id: attach.id }))
          }
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
    const projects = await this.prisma.project.findMany({
      skip,
      take: limit,
    });
    const totalProjects = await this.prisma.project.count();
    const hasNextPage = skip + projects.length < totalProjects;

    return {
        data: projects,
        page,
        limit,
        next: hasNextPage
    };
  }

  async getById(id: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async getBySlug(slug: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({ where: { slug } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const { links, name, ...projectData } = data;

    const updateData: Prisma.ProjectUpdateInput = { ...projectData };

    if (name) {
      updateData.name = name;
      updateData.slug = await this.generateSlug(name);
    }

    if (links) {
      updateData.links = {
        update: links,
      };
    }

    return this.prisma.project.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }
}
