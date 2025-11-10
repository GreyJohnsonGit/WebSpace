import postgres from 'postgres';

export function SqlQuery() {
  const sql = postgres(process.env.DATABASE_URL!);

  return [
    {
      getAllWeights: async () => 
        await sql`SELECT * FROM Weight`,
      insertWeight: async (user_id: string, weight_kg: number) => 
        await sql`
          INSERT INTO Weight (user_id, weight_kg) 
          VALUES (${user_id}, ${weight_kg})`,
      updateWeight: async (
        user_id: string, 
        weight_kg: number, 
        weight_recorded_at: Date
      ) => 
        await sql`
          UPDATE Weight 
          SET weight_kg = ${weight_kg} 
          WHERE user_id = ${user_id} 
          AND weight_recorded_at = ${weight_recorded_at}`,
      deleteWeight: async (user_id: string) => 
        await sql`DELETE FROM Weight WHERE user_id = ${user_id}`,

      getAllUsers: async () => 
        await sql`SELECT * FROM User_Account`,
      insertUser: async (
        user_name: string,
        user_email: string
      ) =>
        await sql`
          INSERT INTO User_Account (user_name, user_email) 
          VALUES (${user_name}, ${user_email})`
    },
    sql.end
  ] as const;
}