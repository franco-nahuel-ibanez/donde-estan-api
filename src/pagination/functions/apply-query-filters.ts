import { SelectQueryBuilder } from 'typeorm';
import { QueryFilterApplier } from './../../helpers/queryFilterApplier';

export async function applyQueryFilters<T, K>(
  query: SelectQueryBuilder<T>,
  filterApplier: QueryFilterApplier<T, K>,
) {
  for (const prop of Object.keys(filterApplier).filter(
    (key) =>
      filterApplier[key].value != null && filterApplier[key].value !== '',
  )) {
    query = await filterApplier[prop].applier(filterApplier[prop].value, query);
  }

  return query;
}
