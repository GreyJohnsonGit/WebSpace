import express, { response } from 'express';
import dotenv from 'dotenv';
import { SqlQuery } from './SqlQuery';
import cors from 'cors';
import { Weight } from 'health-tracker-common';

(async function main() {
  dotenv.config({ quiet: true });
  const [sql] = SqlQuery();

  const app = express();
  const port = process.env.PORT || 3000;

  if (process.env.ENVIRONMENT === 'development') {
    app.use(cors());
  }

  app.use(express.json());

  app.use((request, response, next) => {
    console.log(`${request.method} ${request.path}`);
    next();
  });

  app.get('/', (_request, response) => {
    response.send('Health Tracker Service is running!');
  });
  
  const v1Router = express.Router(); {
    const health = express.Router();

    health.get('/weight', async (_request, response) => {
      response.json(await sql.getAllWeights());
    });

    health.post('/weight', async (request, response) => {
      const { user_id, weight_kg } = request.body;
      await sql.insertWeight({ user_id, weight_kg });
      response.json({ message: 'Weight data saved endpoint v1' });
    });

    health.put('/weight', async (request, response) => {
      const { user_id, weight_kg, weight_recorded_at } = request.body;
      await sql.updateWeight({ user_id, weight_kg, weight_recorded_at });
      response.json({ message: 'Weight data updated endpoint v1' });
    });

    health.delete('/weight', async (request, response) => {
      const { user_id, weight_recorded_at } = Weight
        .pick({ user_id: true, weight_recorded_at: true })
        .parse(request.body);
      await sql.deleteWeight({ user_id, weight_recorded_at });
      response.json({ message: 'Weight data deleted endpoint v1' });
    });

    v1Router.use('/health', health);

    const user = express.Router();

    user.get('/', async (_request, response) => {
      response.json(await sql.getAllUsers());
    });

    user.post('/', async (request, response) => {
      const { user_name, user_email } = request.body;
      await sql.insertUser({ user_name, user_email });
      response.json({ message: 'User data saved endpoint v1' });
    });

    user.put('/', async (request, response) => {
      const { user_id, user_name, user_email } = request.body;
      await sql.updateUser({ user_id, user_name, user_email });
      response.json({ message: 'User data updated endpoint v1' });
    });

    user.delete('/', async (request, response) => {
      const { user_id } = request.body;
      await sql.deleteUser({ user_id });
      response.json({ message: 'User data deleted endpoint v1' });
    });

    v1Router.use('/user', user);
  }

  app.use('/api/v1', v1Router);

  app.listen(port, () => {
    console.log(`Health Tracker Service is listening on port ${port}`);
  });
})();
