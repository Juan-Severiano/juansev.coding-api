import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [CertificatesService, PrismaService],
  controllers: [CertificatesController],
})
export class CertificatesModule {}
