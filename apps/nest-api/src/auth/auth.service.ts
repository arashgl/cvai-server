import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@lib/shared/database/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  clientURL: string;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.clientURL = configService.getOrThrow('CLIENT_URL');
    if (!this.clientURL.endsWith('/')) {
      this.clientURL += '/';
    }
  }

  async register(createUserDto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;

    return this.genPayload(result as User);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.genPayload(user);
  }

  genPayload(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async validateGoogleUser(details: { email: string; googleId: string }) {
    const user = await this.userRepository.findOne({
      where: { email: details.email },
    });
    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = details.googleId;
        user.password = 'Unknown';
        await this.userRepository.save(user);
      }
      return user;
    }

    // Create new user if doesn't exist
    const newUser = this.userRepository.create({
      email: details.email,
      googleId: details.googleId,
      isEmailVerified: true, // Google OAuth emails are verified
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  async googleLogin(googleUser: User, res: Response) {
    if (!googleUser) {
      throw new UnauthorizedException();
    }

    const user = await this.validateGoogleUser({
      email: googleUser.email,
      googleId: googleUser.googleId,
    });

    const { token } = this.genPayload(user);
    res.redirect(this.clientURL + `auth/login?token=${token}`);
  }
}
