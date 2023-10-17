import { buildJsonSchemas, BuildJsonSchemasOptions } from 'fastify-zod';
import { z } from 'zod';

const userCore = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  name: z.string(),
};

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

interface UserSchemasOptions extends BuildJsonSchemasOptions {
  createUserSchema: z.ZodObject<any>;
  createUserResponseSchema: z.ZodObject<any>;
  loginSchema: z.ZodObject<any>;
  loginResponseSchema: z.ZodObject<any>;
}

const models = {
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
};

const options: UserSchemasOptions = {
  $id: 'UserSchema',
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
};

export const { schemas: userSchemas, $ref } = buildJsonSchemas(models, options);
