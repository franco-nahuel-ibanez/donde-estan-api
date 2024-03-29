import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderedPaginatedQueryDto } from 'src/pagination/pagination-data.interface'; 
import { ReportedPerson } from '../entities/reported-person.entity';

export class ReportFilterDto extends OrderedPaginatedQueryDto<ReportedPerson> {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  // @IsArray()
  searchFields?: string[];

  @IsOptional() //[TODO] Agregar ordenamiento por fecha
  @IsString()
  orderByDate?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  orderByUpdate?: 'ASC' | 'DESC';  
}