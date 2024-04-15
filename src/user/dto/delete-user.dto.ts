import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}