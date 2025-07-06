import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateLinkDto {
  @IsUrl()
  @IsOptional()
  github?: string;

  @IsUrl()
  @IsOptional()
  figma?: string;

  @IsUrl()
  @IsOptional()
  publicUrl?: string;
}
