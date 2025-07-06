import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
