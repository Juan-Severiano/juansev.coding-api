import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsUrl()
  @IsNotEmpty()
  github: string;

  @IsUrl()
  @IsNotEmpty()
  figma: string;

  @IsUrl()
  @IsNotEmpty()
  publicUrl: string;
}
