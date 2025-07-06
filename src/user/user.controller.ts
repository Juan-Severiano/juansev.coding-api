import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create';
import { UpdateUserDto } from './dto/update';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number,
  ) {
    return this.userService.getAll({ page, limit });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Get('username/:username')
  async getByUsername(@Param('username') username: string) {
    return this.userService.getByUsername(username);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.userService.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
