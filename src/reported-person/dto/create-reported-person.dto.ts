import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateReportedPersonDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio'})
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio'})
  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'La fecha de desaparición es obligatoria'})
  @IsString()
  dateOfDisappearance: string;

  @IsNotEmpty({ message: 'El país es obligatorio'})
  @IsString()
  country: string;

  @IsNotEmpty({ message: 'La provincia es obligatoria'})
  @IsString()
  province: string;

  @IsNotEmpty({ message: 'La localidad es obligatoria'})
  @IsString()
  locality: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria'})
  @IsString()
  description: string;
}
