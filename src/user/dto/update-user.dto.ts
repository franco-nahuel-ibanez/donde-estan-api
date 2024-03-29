import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  confirmEmail: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
}
