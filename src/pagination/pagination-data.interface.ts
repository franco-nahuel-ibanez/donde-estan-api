import {
  Equals,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderedPaginatedQueryDto<T>
  implements OrderedPaginatedQueryOptions<T>
{
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @IsNumber()
  @Type(() => Number)
  size = 25;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.dir === undefined)
  @Equals(undefined)
  sort?: keyof T | 'id' = 'id';

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.sort === undefined)
  @Equals(undefined)
  dir?: 'ASC' | 'DESC' = 'DESC';
}

export type OrderedPaginatedQueryOptions<T> = Partial<
  OrderQueryResultOptions<T>
> &
  PaginatedQueryOptions;

export interface OrderQueryResultOptions<T> {
  sort: keyof T | 'id';
  dir: 'ASC' | 'DESC';
}

export interface PaginatedQueryOptions {
  page: number;
  size: number;
}

export interface PaginatedResponse<T> {
  data: Array<T>;
  columns?: ColumnNamesMapper<T>;
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export type ColumnNamesMapper<T> = {
  [K in keyof T]: string;
};
