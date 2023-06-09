import * as moment from 'moment';

const router = (fastify, { }, next) => {
  fastify.addHook('preHandler', async (request) => {
    const ip = request.headers["x-real-ip"] ||
      request.headers["x-forwarded-for"] || request.ip;
    console.log(moment().format('HH:mm:ss'), ip, request.url);
  });
  fastify.get('/', async (req: any, reply: any) => {
    reply.send({
      apiName: global.appVersion.description,
      version: global.appVersion.version,
      subVersion: global.appVersion.subVersion,
      date_response: moment().locale('th').format('YYYY-MM-DD HH:mm:ss'),
    });
  });

  next();
}

module.exports = router;