import { IsString, IsNotEmpty, IsInt, IsUrl } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @IsNotEmpty()
  workload: number;
}
