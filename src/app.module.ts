import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttachModule } from './attach/attach.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { LinksModule } from './links/links.module';
import { CompanyModule } from './company/company.module';
import { ProjectModule } from './project/project.module';
import { PrismaService } from './prisma/prisma.service';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [
    OwnerModule,
    AttachModule,
    UserModule,
    AuthModule,
    CertificatesModule,
    LinksModule,
    CompanyModule,
    ProjectModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
