import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAttachDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
