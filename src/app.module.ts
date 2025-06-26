import { Module } from '@nestjs/common';
import { AttachModule } from './attach/attach.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { LinksModule } from './links/links.module';
import { CompanyModule } from './company/company.module';
import { ProjectModule } from './project/project.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AttachModule, UserModule, AuthModule, CertificatesModule, LinksModule, CompanyModule, ProjectModule],
  providers: [PrismaService],
})
export class AppModule {}
