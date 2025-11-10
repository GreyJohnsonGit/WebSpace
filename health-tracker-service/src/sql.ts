import postgres from 'postgres';



export function SqlQuery() {
  const sql = postgres(process.env.DATABASE_URL!);

  return [
    {
      getAllWeights: async () => 
        await sql`SELECT * FROM Weight`,
      insertWeight: async (user_id: string, weight_kg: number) => 
        await sql`INSERT INTO Weight (user_id, weight_kg) VALUES (${user_id}, ${weight_kg})`,
      updateWeight: async (user_id: string, weight_kg: number) => 
        await sql`UPDATE Weight SET weight_kg = ${weight_kg} WHERE user_id = ${user_id}`,
      deleteWeight: async (user_id: string) => 
        await sql`DELETE FROM Weight WHERE user_id = ${user_id}`
    }, 
    sql.end
  ] as const;
}