import { describe, it as jestIt, expect, afterAll } from '@jest/globals';
import { SqlQuery } from '../src/sql';
import dotenv from 'dotenv';

describe(SqlQuery.name, () => {
  dotenv.config({ quiet: true });  
  const [sql, sqlEnd] = SqlQuery();

  let it = jestIt.skip;
  if (process.env.DATABASE_TESTS === '1') {
    it = jestIt;
  }

  it('should return all weights', async () => {
    const result = await sql.getAllWeights();
    expect(result).toBeInstanceOf(Array);
  });

  afterAll(async () => {
    await sqlEnd();
  });
});