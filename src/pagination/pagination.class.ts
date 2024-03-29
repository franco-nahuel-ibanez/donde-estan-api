import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { applyOrderBy } from '../helpers/addOrderBy';
import {
  ColumnNamesMapper,
  OrderedPaginatedQueryOptions,
  PaginatedQueryOptions,
  PaginatedResponse,
} from './pagination-data.interface';
import {
  FilterOperator,
  Paginate,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';

export class Pagination {
  private static logger = new Logger(Pagination.name, { timestamp: true });
  static async getQueryPage<T>(
    pageOptions: OrderedPaginatedQueryOptions<T>,
    query: SelectQueryBuilder<T>,
    getRawData: boolean,
  ): Promise<[T[], number]> {
    try {
      query = applyOrderBy(
        query,
        `${query.alias}.${String(pageOptions.sort)}`,
        pageOptions.dir,
      );
      query
        .skip((pageOptions.page - 1) * pageOptions.size)
        .take(pageOptions.size);

      this.logger.verbose('Sort: ' + String(pageOptions.sort));
      //this.logger.debug('Alias: ' + query.alias);
      //this.logger.debug('Query: ' + query.getSql());

      if (!getRawData) {
        return await query.getManyAndCount();
      } else {
        return [await query.getRawMany(), await query.getCount()];
      }
    } catch (error) {
      this.logger.error('Error performing paginated query: ', error.stack);
      throw new InternalServerErrorException();
    }
  }

  static buildPaginatedResponse<T>(
    data: Array<T>,
    totalElements: number,
    pageOptions: PaginatedQueryOptions,
    columns?: ColumnNamesMapper<T>,
  ): PaginatedResponse<T> {
    const res = {
      columns,
      data,
      page: +pageOptions.page,
      size: +pageOptions.size,
      totalElements: +totalElements,
      totalPages:
        Math.trunc(+totalElements / +pageOptions.size) +
        (+totalElements % +pageOptions.size > 0 ? 1 : 0),
    };
    this.logger.debug(JSON.stringify({ ...res, data: null }));
    return res;
  }

  static async getPaginatedResponse<T>(
    pageOptions: OrderedPaginatedQueryOptions<T>,
    query: SelectQueryBuilder<T>,
  ): Promise<PaginatedResponse<T>>;
  static async getPaginatedResponse<T, K>(
    pageOptions: OrderedPaginatedQueryOptions<T>,
    query: SelectQueryBuilder<T>,
    // sortableColumns: Column<T>[],
    asyncFormatResponseRow: (dataObj: T) => Promise<K>,
    columns?: ColumnNamesMapper<K>,
    getRawData?: boolean,
  ): Promise<PaginatedResponse<K>>;

  static async getPaginatedResponse<T, K>(
    pageOptions: OrderedPaginatedQueryOptions<T>,
    query: SelectQueryBuilder<T>,
    // sortableColumns: Column<T>[],
    asyncFormatResponseRow?: (dataObj: T) => Promise<K>,
    columns?: ColumnNamesMapper<K>,
    getRawData = false,
  ): Promise<PaginatedResponse<T | K>> {
    const paginateQuery: PaginateQuery = {
      page: pageOptions.page,
      limit: pageOptions.size,
      // sortBy?: [string, string][];
      sortBy: [[pageOptions.sort as string, pageOptions.dir]],
      // searchBy?: string[];
      // search?: string;
      // filter?: {
      //     [column: string]: string | string[];
      // };
      path: '',
    };

    const pages = await paginate<any>(paginateQuery, query, {
      sortableColumns: ['id'],
      // nullSort: 'last',
      // searchableColumns: ['name', 'color', 'age'],
      // defaultSortBy: [['id', 'DESC']],
    });

    // POR QUE ES ASYNC??
    if (asyncFormatResponseRow) {
      const pagesData = await Promise.all(
        pages.data.map(asyncFormatResponseRow),
      );
      const mappedPagesPaginator: PaginatedResponse<K> = {
        columns,
        data: pagesData,
        page: pages.meta.currentPage,
        size: pages.meta.itemsPerPage,
        totalElements: pages.meta.totalItems,
        totalPages: pages.meta.totalPages,
      };
      return mappedPagesPaginator;
    } else {
      const mappedPagesPaginator: PaginatedResponse<T> = {
        data: pages.data,
        page: pages.meta.currentPage,
        size: pages.meta.itemsPerPage,
        totalElements: pages.meta.totalItems,
        totalPages: pages.meta.totalPages,
      };
      return mappedPagesPaginator;
    }
  }
}
