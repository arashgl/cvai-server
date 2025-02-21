import {
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsString,
  IsEmail,
} from 'class-validator';

export class RegisterDto {
  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
