import { SqlQuery } from './SqlQuery';
import z from 'zod';
import dotenv from 'dotenv';


type MethodType = z.infer<typeof MethodType>;
const MethodType = z.enum(['get', 'post', 'put', 'delete']);

type ApiRoute = z.infer<typeof ApiRoute>;
const ApiRoute = z.enum([
  '/api/v1/health/weight',
  '/api/v1/user'
]);

(async function main() {
  dotenv.config({ quiet: true });
  const args = process.argv.slice(2);
  const apiRoute = ApiRoute.parse(args[0]);
  const method = MethodType.parse(args[1]);
  const [sql, sqlEnd] = SqlQuery();
  let actionMap: { [key in MethodType]: () => Promise<void> };

  if (
    apiRoute === '/api/v1/user'
  ) {
    actionMap = {
      get: async () => {
        sql.getAllUsers().then(console.log);
      },
      post: async () => {
        const [user_name, user_email] = z
          .tuple([z.string(), z.string()])
          .parse(args.slice(2));
        sql
          .insertUser({ user_name, user_email })
          .then(console.log);
      },
      put: async () => {
        console.error('No PUT method for /api/v1/user');
      },
      delete: async () => {
        console.error('No DELETE method for /api/v1/user');
      }
    }
  }

  if (
    apiRoute === '/api/v1/health/weight'
  ) {
    actionMap = {
      get: async () => {
        sql.getAllWeights().then(console.log);
      },
      post: async () => {
        const [user_id, weight_kg] = z
          .tuple([z.string(), z.coerce.number()])
          .parse(args.slice(2));
        sql
          .insertWeight({ user_id, weight_kg })
          .then(console.log);
      },
      put: async () => {
        const [user_id, weight_kg, weight_recorded_at] = z
          .tuple([z.string(), z.coerce.number(), z.coerce.date()])
          .parse(args.slice(2));
        sql
          .updateWeight({ user_id, weight_kg, weight_recorded_at })
          .then(console.log);
      },
      delete: async () => {
        const [user_id] = z
          .tuple([z.string()])
          .parse(args.slice(2));
        sql
          .deleteWeight({ user_id })
          .then(console.log);
      }
    }
  }

  await actionMap![method]();
  await sqlEnd();
  process.exit(0);
})();

