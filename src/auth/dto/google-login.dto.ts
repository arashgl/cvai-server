import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1255)
  @IsNotEmpty()
  token: string;
}
