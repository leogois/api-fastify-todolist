import Fastify from 'fastify';

import { userRoutes } from './modules/user/user.route';

const server = Fastify();

server.get('/hello', async (request, reply) => {
  return { status: 'ok' };
});

const main = async () => {
  server.register(userRoutes, { prefix: 'api/users' });

  try {
    await server.listen({ port: 3000 });
    console.log(`Server ready at http://localhost:3000`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
