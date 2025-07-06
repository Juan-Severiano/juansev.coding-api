import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachService } from './attach.service';
import { multerConfig } from '@/config/multer';

@Controller('attaches')
export class AttachController {
  constructor(private readonly attachService: AttachService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.attachService.create(file);
  }

  @Get()
  getAll(
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number,
  ) {
    return this.attachService.getAll({ page, limit });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.attachService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.attachService.delete(id);
  }
}
