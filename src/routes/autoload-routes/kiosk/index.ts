import * as os from 'os';
import { StatusCodes } from 'http-status-codes';
import { HosxpV4Model } from '../../../models/his/hosxpV4';
// import * as moment from 'moment';
const hosxpV4Model = new HosxpV4Model();

const router = (fastify, { }, next) => {

    fastify.get('/api_alive', async (req: any, reply: any) => {
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
    });

    fastify.post('/getPatientVisitByCid', async (req: any, reply: any) => {
        const body: any = req.body;

        const cid = body.cid;
        try {
            const patient: any = await hosxpV4Model.getDataOne(global.dbHIS, 'patient', `cid = ${cid}`);

            if (patient) {
                const ovst: any = await hosxpV4Model.getOvstTodayPttype(global.dbHIS, patient.hn);
                reply.send({
                    statusCode: StatusCodes.OK,
                    rows: { patient, ovst }
                });
            } else {
                reply.send({
                    statusCode: StatusCodes.OK,
                    rows: { patient, ovst: null }
                });
            }
        } catch (error) {
            reply.send({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    });

    fastify.post('/updatePhone', async (req: any, reply: any) => {
        const body: any = req.body;

        const phone = body.phone;
        const hn = body.hn;

        try {
            const result: any = await hosxpV4Model.update(global.dbHIS, 'patient', `hn = ${hn}`, { "mobile_phone_number": phone });
            // console.log(result);
            reply.send({
                statusCode: StatusCodes.OK,
                rows: result
            });
        } catch (error) {
            reply.send({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    });

    fastify.put('/updateAuthenCode', async (req: any, reply: any) => {
        const body: any = req.body;

        const hn = body.hn;
        const claimCode = body.claim_code;
        const ovst = body.ovst;
        try {
            if (hn && claimCode) {
                // !ตัดค่าออกจากอาร์เรย์ pttype_price_group_id 3,5 ออก
                const filteredOvst = ovst.filter((item) => item.pttype_price_group_id !== 3 && item.pttype_price_group_id !== 5);

                for await (const v of filteredOvst) {
                    console.log(v.vn);
                }
                // await hosxpV4Model.updateVN_VisitPttypeAuthen(global.dbHIS, { auth_code: claimCode }, hn);

                // const result: any = await hosxpV4Model.deletePtNoteToday(global.dbHIS, hn);

                // reply.send({
                //     statusCode: StatusCodes.OK,
                //     rows: result,
                // });
            } else if (!hn && claimCode) {
                reply.send({
                    statusCode: StatusCodes.OK,
                    rows: '',
                });
            } else {
                reply.send({
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: 'ไม่มี claim_code'
                });
            }
        } catch (error) {
            reply.send({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    });

    next();

}

module.exports = router;