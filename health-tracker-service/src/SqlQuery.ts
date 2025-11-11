import postgres from 'postgres';
import { Weight, UserAccount } from 'health-tracker-common';
import { isDefined } from './TypeExt/IsDefined';

export function SqlQuery() {
  const sql = postgres(process.env.DATABASE_URL!);
  const sqlEnd = sql.end;

  const queryExecutor = {
    getAllWeights() {
      return sql`SELECT * FROM Weight`;
    },
    insertWeight(weight: Omit<Weight, 'weight_recorded_at'>) {
      const { user_id, weight_kg } = weight;
      return sql`
        INSERT INTO Weight (user_id, weight_kg) 
        VALUES (${user_id}, ${weight_kg})`;
    },
    updateWeight(weight: Weight) {
      const { user_id, weight_kg, weight_recorded_at } = weight;
      return sql`
        UPDATE Weight 
        SET weight_kg = ${weight_kg}
        WHERE user_id = ${user_id} 
        AND 
          DATE_TRUNC('second', weight_recorded_at) = 
          DATE_TRUNC('second', ${weight_recorded_at})`
    },
    deleteWeight(weight: Pick<Weight, 'user_id' | 'weight_recorded_at'>) {
      const { user_id, weight_recorded_at } = weight;
      return sql`
        DELETE FROM Weight 
        WHERE user_id = ${user_id} 
        AND 
          DATE_TRUNC('second', weight_recorded_at) = 
          DATE_TRUNC('second', ${weight_recorded_at})`;
    },

    getAllUsers() {
      return sql`SELECT * FROM UserAccount`;
    },
    insertUser(
      user: Pick<UserAccount, 'user_name' | 'user_email'>,
    ) {
      const { user_name, user_email } = user;
      return sql`
        INSERT INTO UserAccount (user_name, user_email) 
        VALUES (${user_name}, ${user_email})`;
    },
    updateUser(
      user: Omit<
        Partial<UserAccount> & Omit<UserAccount, 'user_name' | 'user_email'>,
        'user_created_at'
        >
    ) {
      const { user_id, user_name, user_email } = user;
      const setOperations = ([
        ['user_name', user_name],
        ['user_email', user_email]
      ] as const)
        .filter(([, value]) => isDefined(value))
        .map(([key, value]) => `${key} = ${value}`)
        .join(', ');

      if (setOperations.length === 0) {
        throw new Error('No fields to update for UserAccount');
      }

      return sql`
        UPDATE UserAccount 
        SET ${setOperations} 
        WHERE user_id = ${user_id}`;
    },

    deleteUser(user: Pick<UserAccount, 'user_id'>) {
      const { user_id } = user;
      return sql`DELETE FROM UserAccount WHERE user_id = ${user_id}`;
    }
  }

  return [queryExecutor, sqlEnd] as const;
}