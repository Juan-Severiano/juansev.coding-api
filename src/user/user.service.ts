import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as crypto from 'node:crypto';
import { Prisma, User } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async users(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  async create(data: Prisma.UserCreateInput) {
    const possibleUserWithEmail = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (possibleUserWithEmail) {
      return new ConflictException({
        message: 'User with same email already exists',
      });
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

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<Omit<User, 'password'>> {
    const { where, data } = params;
    if (data.password) {
      data.password = crypto
        .createHash('sha256')
        .update(String(data.password))
        .digest('hex');
    }

    const user = await this.prisma.user.update({
      data,
      where,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async delete(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.delete({
      where,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string) {
    const user = this.prisma.user.findUnique({
      where: {
        email
      }
    })

    return user
  }
}
