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
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create';
import { UpdateProjectDto } from './dto/update';
import { multerConfig } from '@/config/multer';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cover', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ],
      multerConfig,
    ),
  )
  create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() files: { cover?: Express.Multer.File[], photo?: Express.Multer.File[], images?: Express.Multer.File[] },
  ) {
    return this.projectService.create(createProjectDto, files);
  }

  @Get()
  getAll(
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number,
  ) {
    return this.projectService.getAll({ page, limit });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.projectService.getById(id);
  }

  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.projectService.getBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projectService.delete(id);
  }
}
