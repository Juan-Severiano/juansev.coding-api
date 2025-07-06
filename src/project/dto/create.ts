import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLinkDto } from '@/links/dto/create';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  skills: string[];

  @ValidateNested()
  @Type(() => CreateLinkDto)
  links: CreateLinkDto;

  @IsUUID()
  @IsOptional()
  companyId?: string;
}
