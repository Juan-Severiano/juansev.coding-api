import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { UserRole } from 'generated/prisma';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: UserRole;
}
