import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginAuthDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { UserService } from '@/user/user.service';

interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginParams: LoginAuthDTO) {
    return this.authService.authenticate(loginParams);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getUserInfo(@Request() request: AuthenticatedRequest) {
    return this.userService.getById(request.user.id);
  }
}
