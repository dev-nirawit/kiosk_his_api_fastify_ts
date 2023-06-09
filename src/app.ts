var path = require('path');
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import Fastify from 'fastify'
import route from "./route";

const serveStatic = require('serve-static');
require('dotenv').config({ path: path.join(__dirname, '../config') });

import { Jwt } from './middleware/jwt';
import moment = require('moment');
var jwt = new Jwt();

var helmet = require('@fastify/helmet');

const app = Fastify({
  logger: { level: 'error' },
  bodyLimit: 5 * 1048576,
});

app.register(require('@fastify/formbody'));
app.register(require('@fastify/cors'), {});
app.register(require('fastify-no-icon'));
app.register(
  helmet,
  { contentSecurityPolicy: false }
);

app.register(require('@fastify/rate-limit'), {
  max: process.env.MAX_CONNECTION_PER_MINUTE || 100,
  timeWindow: '1 minute'
});
// app.register(require('fastify-axios'));

app.register(serveStatic(path.join(__dirname, '../public')));
app.register(require('@fastify/jwt'), {
  secret: process.env.SECRET_KEY
});

var templateDir = path.join(__dirname, '../templates');
app.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs')
  },
  templates: templateDir
});

app.decorate("checkAuthenticate", async (request, reply) => {
  let token: any;
  if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
    token = request.headers.authorization.split(' ')[1];
  }

  try {
    await jwt.verify(token);
  } catch (err) {
    console.log(err.message);
    reply.status(StatusCodes.OK).send({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: getReasonPhrase(StatusCodes.UNAUTHORIZED)
    })
  }
});

// *DB Connect ================================
const dbConnection = require('./middleware/db');
global.dbHIS = dbConnection('HIS');


// *Add Route path ================================
const autoload = require('@fastify/autoload')
app.register(autoload, {
  dir: path.join(__dirname, 'routes/autoload-routes')
})

// ! >>>> กำหนดเส้นทางเอง <<<<
// app.register(route);


app.addHook('preHandler', async (request) => {
  const ip = request.headers["x-real-ip"] ||
    request.headers["x-forwarded-for"] || request.ip;
  console.log(moment().format('HH:mm:ss'), ip, request.url);
});

// Define version ================================
const { name, version, subVersion, description } = require('./../package.json');
global.appVersion = { name, version, subVersion, description };

// Start Service ================================
let serverOption: any = {
  port: process.env.PORT || 88,
  host: process.env.HOST || '0.0.0.0'
};

app.listen(serverOption, (err) => {
  if (err) throw err;
  console.log(description + ' Running at ' + moment().locale('th').format('YYYY-MM-DD'), app.server.address());
});