import fjwt, { JWT } from '@fastify/jwt';
import swagger from '@fastify/swagger';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';

import { version } from '../package.json';
import { userRoutes } from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

export const buildServer = () => {
  const server = Fastify();

  server.register(fjwt, {
    secret: 'ndkandnan78duy9sau87dbndsa89u7dsy789adb',
  });

  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  });

  server.get('/hello', async (request, reply) => {
    return { status: 'ok' };
  });

  server.addHook('preHandler', (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });

  for (const schema of [...userSchemas]) {
    server.addSchema(schema);
  }

  const swaggerOptions = {
    routePrefix: '/docs',
    exposeRoute: true,
    staticCSP: true,
    openapi: {
      info: {
        title: 'Fastify API',
        description: 'API for some products',
        version,
      },
    },
  };

  server.register(swagger, swaggerOptions);

  server.register(userRoutes, { prefix: 'api/users' });

  return server;
};
