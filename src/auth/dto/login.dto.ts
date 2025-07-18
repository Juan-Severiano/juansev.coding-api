import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
