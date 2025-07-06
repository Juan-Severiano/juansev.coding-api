import { IsString, IsOptional } from 'class-validator';

export class UpdateAttachDto {
  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  @IsOptional()
  type?: string;
}
