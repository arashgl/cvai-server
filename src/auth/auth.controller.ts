import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '@server/auth/dto/register.dto';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  ResetPasswordStep2Dto,
} from '@server/auth/dto/reset-password.dto';
import { GetUser } from '@server/auth/decorators/user.decorator';
import {
  ChangeEmailDto,
  ChangeEmailStep2Dto,
} from '@server/auth/dto/change-email.dto';
import { GoogleLoginDto } from '@server/auth/dto/google-login.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

import { LocalhostGuard } from '@server/auth/guards/localhost.guard';
import { AllowLocalhostOnly } from '@server/auth/decorators/local-only.decorator';
import { User } from '@lib/shared/database';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(LocalhostGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // async login(@Body() loginByWalletDto: LoginByWalletDto) {
  //   return await this.authService.loginByWallet(loginByWalletDto);
  // }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('change-email')
  @ApiBearerAuth()
  async changeEmail(@Body() body: ChangeEmailDto, @GetUser() user: User) {
    return await this.authService.changeEmail(body, user);
  }

  @Post('verify-email')
  @ApiBearerAuth()
  async confirmEmail(@Body() body: ChangeEmailStep2Dto, @GetUser() user: User) {
    return await this.authService.verifyEmail(user, body);
  }

  @Public()
  @Get('token')
  @HttpCode(HttpStatus.OK)
  @AllowLocalhostOnly()
  async getToken() {
    return await this.authService.generateToken();
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(body);
  }

  @Public()
  @Get('random-token')
  @SkipThrottle()
  @AllowLocalhostOnly()
  async generateRandomToken() {
    return await this.authService.generateRandomToken();
  }

  @Public()
  @Get('login-as-guest')
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  async loginAsGuest() {
    return await this.authService.loginAsGuest();
  }

  @Post('complete-sign-up')
  async completeSignUp(@GetUser() user: User, @Body() body: RegisterDto) {
    return await this.authService.completeSignUp(user, body);
  }

  @Public()
  @Post('reset-password-step-2')
  async resetPasswordStepTwo(@Body() body: ResetPasswordStep2Dto) {
    return await this.authService.resetPasswordStep2(body);
  }

  @Post('change-password')
  async changePassword(@Body() body: ChangePasswordDto, @GetUser() user: User) {
    return await this.authService.changePassword(body, user);
  }

  @Public()
  @Get('check/:wallet_address')
  async checkUser(@Param('wallet_address') wallet_address: string) {
    return await this.authService.checkUser(wallet_address);
  }

  @Get('check-token/:token')
  checkAuth(@Param('token') token: string) {
    return this.authService.checkAuth(token);
  }

  @Get('exists/:identifier')
  @Public()
  async exists(@Param('identifier') identifier: string) {
    return await this.authService.exists(identifier);
  }

  @Post('google/login')
  @Public()
  async googleLogin(@Body() body: GoogleLoginDto) {
    return this.authService.googleCallback(body);
  }

  @Post('google/firebase/login')
  @Public()
  async googleFirebaseLogin(@Body() body: GoogleLoginDto) {
    return this.authService.googleFirebaseCallback(body);
  }
}
