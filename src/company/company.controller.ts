import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create';
import { UpdateCompanyDto } from './dto/update';
import { multerConfig } from '@/config/multer';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.companyService.create(createCompanyDto, photo);
  }

  @Get()
  getAll(
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number,
  ) {
    return this.companyService.getAll({ page, limit });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.companyService.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.companyService.delete(id);
  }
}
