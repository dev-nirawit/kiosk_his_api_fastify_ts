import { FastifyInstance } from "fastify";

export default async function router(fastify: FastifyInstance) {
  fastify.register(require('./routes/index'), { prefix: '/', logger: true });
}
