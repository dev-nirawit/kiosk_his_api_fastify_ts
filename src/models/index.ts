export class IndexModel {
    getClientIP(req) {
        var ip = (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress);
        if (ip.search(':') !== -1 && ip.search('.') !== -1) {
            let addr = ip.split(':');
            return addr[3];
        }
        else {
            return ip;
        }
    }

}