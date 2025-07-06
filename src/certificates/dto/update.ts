import { IsString, IsOptional, IsInt, IsUrl } from 'class-validator';

export class UpdateCertificateDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsInt()
  @IsOptional()
  workload?: number;
}
