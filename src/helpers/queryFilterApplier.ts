import { SelectQueryBuilder } from 'typeorm';

export type QueryFilterApplier<T, K> = {
  [M in keyof K]: {
    value: K[M];
    applier: (
      value: K[M],
      query: SelectQueryBuilder<T>,
    ) => Promise<SelectQueryBuilder<T>>;
  };
};
