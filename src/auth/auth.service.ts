import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { LoginAuthDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'generated/prisma';
import { UserService } from '@/user/user.service';
import * as crypto from 'node:crypto';

type AuthResult = {
  access: string;
  user: Omit<User, 'password'>;
};

type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async authenticate(input: LoginAuthDTO): Promise<AuthResult> {
    const user = await this.validate(input);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signIn(user);
  }

  async validate(input: LoginAuthDTO) {
    const user = await this.userService.findByEmail(input.email);
    console.log(user)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials aaaa');
    }

    const isPasswordValid = await this.comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials 2');
    }

    return user;
  }

  async signIn(user: User): Promise<AuthResult> {
    const tokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    const access = await this.jwtService.signAsync(tokenPayload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access,
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async checkPermission(user: User, requiredRole: UserRole): Promise<boolean> {
    switch (requiredRole) {
      case UserRole.owner:
        return user.role === UserRole.owner;
      case UserRole.commun:
        return [UserRole.owner, UserRole.commun].includes(user.role);
      default:
        return false;
    }
  }

  async requirePermission(user: User, requiredRole: UserRole): Promise<void> {
    const hasPermission = await this.checkPermission(user, requiredRole);
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }

  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    if (!hash.includes(':')) {
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      return hashedPassword === hash;
    }

    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString('hex'));
      });
    });
  }
}
