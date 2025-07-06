import { Module } from '@nestjs/common';
import { AttachService } from './attach.service';
import { AttachController } from './attach.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [AttachController],
  providers: [AttachService, PrismaService],
})
export class AttachModule {}
