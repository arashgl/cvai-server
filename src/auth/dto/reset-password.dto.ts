import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  identifier: string;
}
export class ResetPasswordStep2Dto {
  @MaxLength(255)
  @MinLength(1)
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

  @MaxLength(10)
  @MinLength(1)
  @IsNotEmpty()
  code: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  new_password: string;
}
