import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @MaxLength(255)
  @MinLength(1)
  @IsNotEmpty()
  password: string;
}

export class LoginByWalletDto {
  @MaxLength(50)
  @MinLength(1)
  @IsNotEmpty()
  wallet_address: string;

  @MaxLength(255)
  signature: string;

  @MaxLength(255)
  nickname: string;

  @MaxLength(255)
  @IsNotEmpty()
  username: string;
}
