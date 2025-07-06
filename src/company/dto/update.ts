import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  responsibleName?: string;

  @IsString()
  @IsOptional()
  responsibleRole?: string;

  @IsUUID()
  @IsOptional()
  photoId?: string;
}
