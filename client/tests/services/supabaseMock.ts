// Helpers for mocking the chained supabase query builder in service tests.
// Usage: vi.mock("<path>/services/supabase", () => ({ supabase: { from: vi.fn(), rpc: vi.fn() } }))

const CHAIN_METHODS = [
  "select",
  "insert",
  "update",
  "delete",
  "eq",
  "order",
  "single",
];

/** A chainable, awaitable stand-in for a supabase query that resolves to `result`. */
export function makeQuery(result: { data?: any; error?: any }) {
  const query: any = {};
  CHAIN_METHODS.forEach((method) => {
    query[method] = vi.fn(() => query);
  });
  query.then = (resolve: any, reject: any) =>
    Promise.resolve(result).then(resolve, reject);
  return query;
}

/** Queue one query per upcoming `supabase.from()` call and return them in order. */
export function queueFrom(
  from: any,
  ...results: { data?: any; error?: any }[]
) {
  return results.map((result) => {
    const query = makeQuery(result);
    from.mockReturnValueOnce(query);
    return query;
  });
}
