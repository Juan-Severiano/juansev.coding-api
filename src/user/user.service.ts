import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as crypto from 'node:crypto';
import { Prisma, User } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getById(
    id: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAll(params: {
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
    });
    const totalUsers = await this.prisma.user.count();
    const hasNextPage = skip + users.length < totalUsers;

    return {
        data: users.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ password, ...userWithoutPassword }) => userWithoutPassword,
        ),
        page,
        limit,
        next: hasNextPage
    };
  }

  async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const possibleUserWithEmail = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (possibleUserWithEmail) {
      throw new ConflictException('User with same email already exists');
    }

    const hashedPassword = crypto
      .createHash('sha256')
      .update(data.password)
      .digest('hex');
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<Omit<User, 'password'>> {
    if (data.password) {
      data.password = crypto
        .createHash('sha256')
        .update(String(data.password))
        .digest('hex');
    }

    const user = await this.prisma.user.update({
      data,
      where: { id },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async delete(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.delete({
      where: { id },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  async getByUsername(username: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
