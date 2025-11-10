import express from 'express';
import dotenv from 'dotenv';
import { SqlQuery } from './sql';

(async function main() {
  dotenv.config({ quiet: true });
  const [sql] = SqlQuery();

  const app = express();
  const port = process.env.PORT || 3000;

  app.get('/', (_request, response) => {
    response.send('Health Tracker Service is running!');
  });

  const v1Router = express.Router();

  v1Router.get('/health/weight', async (_request, response) => {
    response.json(await sql.getAllWeights());
  });

  v1Router.post('/health/weight', async (request, response) => {
    const { user_id, weight_kg } = request.body;
    await sql.insertWeight(user_id, weight_kg);
    response.json({ message: 'Weight data saved endpoint v1' });
  });

  v1Router.put('/health/weight', async (request, response) => {
    const { user_id, weight_kg } = request.body;
    await sql.updateWeight(user_id, weight_kg);
    response.json({ message: 'Weight data updated endpoint v1' });
  });

  v1Router.delete('/health/weight', async (request, response) => {
    const { user_id } = request.body;
    await sql.deleteWeight(user_id);
    response.json({ message: 'Weight data deleted endpoint v1' });
  });

  app.use('/api/v1', v1Router);

  app.listen(port, () => {
    console.log(`Health Tracker Service is listening on port ${port}`);
  });
})();
