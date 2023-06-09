import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

const checkToken = async (req, res, next) => {
  try {
    let token: string = null;
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      console.log('no token');
      res.send({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: getReasonPhrase(StatusCodes.UNAUTHORIZED)
      });
     return false;
    } else {
      const verify = await jwt.verify(token, process.env.SECRET_KEY);
      next();
    }
  } catch (error) {
    console.log('token: ',error.message);
    res.send({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: getReasonPhrase(StatusCodes.UNAUTHORIZED)
    });
    return false;
  }
}

module.exports = checkToken;