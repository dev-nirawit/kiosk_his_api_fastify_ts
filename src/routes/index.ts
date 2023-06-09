import * as os from 'os';
import * as moment from 'moment';
const DeviceDetector = require('node-device-detector');
const detector = new DeviceDetector;

const router = (fastify, { }, next) => {
  fastify.get('/client', async (req: any, reply: any) => {
    var userAgent = req.headers['user-agent'];
    var detected = detector.detect(userAgent);
    const ip = req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] || req.ip;
    reply.send({
      status: 200,
      date_response: moment().locale('th').format('YYYY-MM-DD HH:mm:ss'),
      remoteAddress: req.headers["x-forwarded-for"] || '',
      device: detected.device.type,
      mobileType: detected.device.brand,
      mobileName: detected.device.model,
      ip, detected,
      user_agent: userAgent
    });
  });

  fastify.get('/os', { preHandler: [fastify.checkAuthenticate] }, async (req, reply: any) => {
    const os = require('os');
    reply.send({
      cpu: os.cpus(),
      nic: os.networkInterfaces(),
      os: os.platform(),
      os_release: os.release(),
      os_type: os.type()
    });
  });

  fastify.get('/net', { preHandler: [fastify.checkAuthenticate] }, async (req, reply: any) => {
    const net = require('net');
    reply.send({});
  });

  fastify.get('/server-status', { preHandler: [fastify.checkAuthenticate] }, async (req, reply) => {
    const second = +os.uptime();
    var minute = ((second / 60) % 60).toFixed(1);
    let hour: any = (second / 60 / 60 % 24);
    hour = hour > 0 ? (hour.toFixed(0) + ' hour<s> ') : '';
    let day: any = (second / 60 / 60 / 24);
    day = day > 0 ? (day.toFixed(0) + ' day<s> ') : '';
    const cpu = os.cpus();
    reply.send({
      os: os.platform(),
      type: os.type(),
      arch: os.arch(),
      release: os.release(),
      // version: os.version(),  // nodejs v.13
      hostname: os.hostname(),
      cpu: cpu.length, //os.cpus(),
      load: os.loadavg(),
      network: os.networkInterfaces(),
      // user: os.userInfo(),
      uptime: day + hour + minute + ' min.',
      totalmem: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      freemem: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
    });
  })

  next();

}

module.exports = router;