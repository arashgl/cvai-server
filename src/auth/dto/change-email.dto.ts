import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangeEmailStep2Dto {
  @MaxLength(255)
  @MinLength(1)
  @IsNotEmpty()
  email: string;
  @MaxLength(10)
  @MinLength(1)
  @IsNotEmpty()
  code: string;
}

export class ChangeEmailDto {
  @MaxLength(255)
  @MinLength(1)
  @IsNotEmpty()
  email: string;
}
