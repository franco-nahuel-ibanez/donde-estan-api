import { PartialType } from '@nestjs/mapped-types';
import { CreateReportedPersonDto } from './create-reported-person.dto';

export class UpdateReportedPersonDto extends PartialType(CreateReportedPersonDto) {}
