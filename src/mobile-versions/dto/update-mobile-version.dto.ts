import { PartialType } from '@nestjs/mapped-types';
import { CreateMobileVersionDto } from './create-mobile-version.dto';

export class UpdateMobileVersionDto extends PartialType(CreateMobileVersionDto) {}
