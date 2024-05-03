import { FindOptionsWhere, ILike } from 'typeorm';

export const generateSearchConditions = <T>(searchFields: {
  [key in keyof T]?: string | number | boolean;
}) => {
  const whereSearch: FindOptionsWhere<T> = {};

  const searchEntries = Object.entries(searchFields);

  for (const [key, value] of searchEntries) {
    if (value) {
      whereSearch[key as string] = ILike(`%${value}%`);
    }
  }
  return whereSearch;
};
