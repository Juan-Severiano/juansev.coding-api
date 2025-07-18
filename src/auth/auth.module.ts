import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '@/user/user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, JwtService, UserService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
