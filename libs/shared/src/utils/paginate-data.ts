export async function PaginateData(
  result: any[],
  page: number,
  take: number,
  count: number,
) {
  return {
    result,
    pagination: {
      currentPage: page,
      nextPage: page + 1,
      prevPage: page - 1,
      hasNextPage:
        take >= count ? false : take * (take === 1 ? page + 1 : page) < count,
      hasPrevPage: page > 1,
      lastPage: Math.ceil(count / take),
      count,
      take: take,
    },
  };
}
