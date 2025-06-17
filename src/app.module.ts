import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttachModule } from './attach/attach.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { CeritificatesController } from './ceritificates/ceritificates.controller';
import { LinksModule } from './links/links.module';
import { CompanyController } from './company/company.controller';
import { CompanyModule } from './company/company.module';
import { ProjectController } from './project/project.controller';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [AttachModule, UserModule, AuthModule, CertificatesModule, LinksModule, CompanyModule, ProjectModule],
  controllers: [AppController, CeritificatesController, CompanyController, ProjectController],
  providers: [AppService],
})
export class AppModule {}
