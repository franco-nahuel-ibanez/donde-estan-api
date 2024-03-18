import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La confirmación del email es obligatoria' })
  @IsEmail({}, { message: 'El email no es válido' })
  confirmEmail: string;

  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  phoneNumber: string;

  // [TODO] Add birthdate

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(150, { message: 'La contraseña debe tener como máximo 150 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'La confirmación de la contraseña es obligatoria' })
  @MinLength(6, { message: 'La confirmación de la contraseña debe tener al menos 6 caracteres' })
  @MaxLength(150, { message: 'La confirmación de la contraseña debe tener como máximo 150 caracteres' })
  confirmPassword: string;
}
