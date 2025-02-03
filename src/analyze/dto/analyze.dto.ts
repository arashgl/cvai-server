import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AnalyzeDto {
  file: Express.Multer.File;
}

export class CompareDto {
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10_000)
  jobDescription: string;
}
