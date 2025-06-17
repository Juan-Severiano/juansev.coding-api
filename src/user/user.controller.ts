import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Get('user')
  async getUsers() {
    return this.userService.users();
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.user({ id })
  }

  @Patch('user/:id')
  async updateUser(@Param('id') id: string, @Body() userData: CreateUserDto) {
    return this.userService.update({ where: { id }, data: userData })
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete({
      id,
    });
  }
}
