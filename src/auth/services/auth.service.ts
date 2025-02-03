import { LoginDto } from '@server/auth/dto/login.dto';
import { IJwtPayload } from '@lib/shared/interfaces/auth.interface';
import { UserService } from '@server/user/services/user.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ILike, MoreThan } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { RegisterDto } from '@server/auth/dto/register.dto';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  ResetPasswordStep2Dto,
} from '@server/auth/dto/reset-password.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { EmailService } from '@server/email/email.service';
import * as fs from 'fs';
import * as path from 'path';
import {
  ChangeEmailDto,
  ChangeEmailStep2Dto,
} from '@server/auth/dto/change-email.dto';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthService } from '@server/auth/services/google-auth.service';
import { GoogleLoginDto } from '@server/auth/dto/google-login.dto';
import { RoleEnum, User } from '@lib/shared/database';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
    readonly configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async completeSignUp(user: User, body: RegisterDto) {
    if (user.role !== RoleEnum.GUEST)
      throw new BadRequestException("You can't edit info");

    const email = await this.userService.findOne({
      where: { email: body.email.trim().toLowerCase() },
    });

    if (email) {
      throw new BadRequestException('email exists');
    }
    const username = await this.userService.findOne({
      where: { username: body.username.trim().toLowerCase() },
    });
    if (username) {
      throw new BadRequestException('username exists');
    }

    const new_password = bcrypt.hashSync(body.password.trim(), 10);
    await this.userService.update(user.id, {
      ...body,
      password: new_password,
      role: RoleEnum.USER,
    });
    return this.genPayload(user);
  }

  async loginAsGuest() {
    const username = 'guest' + Math.round(Date.now() / 100);
    const newGuest = await this.userService.create({
      username: username,
      nickname: username,
      role: RoleEnum.GUEST,
      email: username + '@arusense.com',
      password: bcrypt.hashSync(Date.now().toString(), 10),
      character_url: this.configService.get('DEFAULT_AVATAR_URL'),
    });

    return this.genPayload(newGuest);
  }

  async genToken(username: string) {
    const user = await this.userService.findOne({
      where: { username: username.trim().toLowerCase() },
    });
    if (user) {
      return this.genPayload(user);
    }
  }

  async changeEmail(body: ChangeEmailDto, user: User) {
    const { email } = body;
    const user_email = await this.userService.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (user.email === email) {
      throw new BadRequestException({ email: 'You already set this email' });
    }

    if (user_email) {
      throw new BadRequestException({ email: 'email exists' });
    }
    const code = this.genRandomCode4Digit();
    const old_code = await this.cacheManager.get(user.email.toString());
    if (old_code) return;

    await this.cacheManager.set(user.email.toString(), code);
    this.sendCodeWithEmail(email, code.toString(), true).catch((e) => {
      Logger.error(e);
    });
  }

  async verifyEmail(_user: User, body: ChangeEmailStep2Dto) {
    const user = await this.userService.findOne({
      where: { email: _user.email },
    });
    const res = await this.cacheManager.get(user.email.toString());

    if (!res) {
      throw new BadRequestException('Code has expired');
    }

    if (res.toString() !== body.code.toString()) {
      throw new BadRequestException('Invalid code');
    }

    await this.userService.update(user.id, {
      email: body.email.trim().toLowerCase(),
    });
  }

  async changePassword(body: ChangePasswordDto, _user: User) {
    const user = await this.userService.findOne({ where: { id: _user.id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.userService.update(user.id, {
      password: bcrypt.hashSync(body.new_password, 10),
    });
  }

  async resetPassword(body: ResetPasswordDto) {
    const user = await this.userService.findOne({
      where: [
        {
          username: body.identifier.toLowerCase(),
        },
        {
          email: body.identifier.trim().toLowerCase(),
        },
      ],
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const res = await this.cacheManager.get(user.id.toString());
    if (res) {
      return true;
    }
    const code = this.genRandomCode4Digit();
    this.sendCodeWithEmail(user.email, code.toString()).catch((e) => {
      Logger.error(e);
    });
    Logger.verbose(`Code: ${code}`);
    await this.cacheManager.set(user.id.toString(), code);
  }

  genRandomCode4Digit() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  sendCodeWithEmail(to: string, code: string, verify_email = false) {
    const templatePath = path.join(
      __dirname,
      '..',
      'src',
      'email',
      'templates',
      'send-email.html',
    );
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    htmlContent = htmlContent.replace(
      '{{action}}',
      verify_email ? 'verify your email' : 'reset your password',
    );
    htmlContent = htmlContent.replace('{{code}}', code);

    return this.emailService.sendMail({
      subject: verify_email
        ? 'Verify Email Arusense'
        : 'Reset Password Arusense',
      html: htmlContent,
      text: 'Your password reset',
      to: to,
    });
  }

  async resetPasswordStep2(body: ResetPasswordStep2Dto) {
    const user = await this.userService.findOne({
      where: [
        {
          username: body.identifier.toLowerCase(),
        },
        {
          email: body.identifier.trim().toLowerCase(),
        },
      ],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const code = await this.cacheManager.get(user.id.toString());

    if (!code) {
      throw new BadRequestException('Code has expired');
    }

    if (+code !== +body.code) {
      throw new BadRequestException('Invalid code');
    }

    await this.userService.update(user.id, {
      password: bcrypt.hashSync(body.password, 10),
    });

    await this.cacheManager.del(user.id.toString());
  }

  async exists(identifier: string) {
    const user = await this.userService.userRepository.findOne({
      where: [
        { username: identifier.trim().toLowerCase() },
        { email: identifier.trim().toLowerCase() },
      ],
    });
    return !!user;
  }

  async login(body: LoginDto) {
    const { identifier, password } = body;
    const user = await this.userService.userRepository.findOne({
      where: [
        { username: identifier.trim().toLowerCase() },
        { email: identifier.trim().toLowerCase() },
      ],
      select: {
        id: true,
        username: true,
        nickname: true,
        wallet_address: true,
        password: true,
        role: true,
      },
    });
    if (user) {
      if (bcrypt.compareSync(password, user.password.trim())) {
        return this.genPayload(user);
      } else {
        throw new UnauthorizedException('Invalid password');
      }
    } else {
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  async register(body: RegisterDto) {
    const { username, nickname, password, email } = body;
    const user_username = await this.userService.findOne({
      where: { username: username.trim().toLowerCase() },
    });

    if (user_username) {
      throw new BadRequestException({ username: 'username exists' });
    }

    const user_email = await this.userService.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (user_email) {
      throw new BadRequestException({ email: 'email exists' });
    }

    const new_user = await this.userService.create({
      nickname,
      username: username.trim().toLowerCase(),
      password: bcrypt.hashSync(password.trim(), 10),
      email: email.trim().toLowerCase(),
      character_url: this.configService.get('DEFAULT_AVATAR_URL'),
    });

    return this.genPayload(new_user);
  }

  async checkUser(username: string) {
    const user = await this.userService.findOne(
      {
        where: { username: username.toLowerCase() },
      },
      false,
      {
        select: {
          username: true,
          nickname: true,
          wallet_address: true,
        },
      },
    );
    if (!user) {
      return null;
    }
    return user;
  }

  async generateRandomToken() {
    const last_user = await this.userService.findOne({
      where: { id: MoreThan(0) },
      order: { id: 'DESC' },
    });
    // console.log(last_user.id);
    const randomInt = Math.floor(Math.random() * last_user.id) + 1;
    // console.log(randomInt);
    const user = await this.userService.findOne({ where: { id: randomInt } });
    if (user) {
      return this.genPayload(user);
    } else {
      return this.generateRandomToken();
    }
  }

  async checkAuth(bearer: string) {
    try {
      const is_valid: IJwtPayload = this.jwtService.verify(bearer);
      const user = await this.userService.userRepository.findOne({
        where: { id: is_valid.context.id },
      });
      if (!user) {
        throw new UnauthorizedException('invalid_token');
      }
      return user;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async googleFirebaseCallback(body: GoogleLoginDto) {
    const googleUser = await this.googleAuthService.verifyFirebaseToken(
      body.token,
    );
    const user = await this.validateGoogleUser(googleUser);
    return this.genPayload(user);
  }

  async googleCallback(body: GoogleLoginDto) {
    const googleUser = await this.googleAuthService.verifyToken(body.token);
    const user = await this.validateGoogleUser(googleUser);
    return this.genPayload(user);
  }

  async generateToken() {
    const user = await this.userService.userRepository.findOne({
      where: { id: MoreThan(0), role: RoleEnum.ADMIN },
    });
    return this.genPayload(user);
  }

  async validateGoogleUser(googleUser: any) {
    const user = await this.userService.findOne({
      where: {
        email: googleUser.email,
      },
    });
    if (user) {
      return user;
    }
    let username = googleUser.email.split('@')[0];
    while (true) {
      const isExist = await this.userService.findOne({
        where: {
          username: username?.toLowerCase(),
        },
      });
      if (!isExist) {
        break;
      }
      //generate unique username
      username = username + Math.floor(Math.random() * 1000);
    }
    return this.userService.create({
      email: googleUser.email,
      username: username.toLowerCase(),
      nickname: googleUser.nickname,
      password: bcrypt.hashSync(googleUser.email + username, 10),
    });
  }

  genPayload(user: User) {
    const payload = {
      context: {
        role: user.role,
        id: user.id,
        username: user.username.toLowerCase(),
      },
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '30d',
      }),
      user,
    };
  }
}
