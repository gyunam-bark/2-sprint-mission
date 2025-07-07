import HTTP_STATUSES from '../common/http.status.mjs';
import { errorWithStatus } from '../util/error.util.mjs';
import * as authDtos from './auth.dto.mjs';
import * as authServices from './auth.services.mjs';

const handleLogin = async (req, res, next) => {
  try {
    const [loginError, validatedBody] = authDtos.validateLogin(req.body);
    if (loginError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, loginError.message);
    }

    const [ipError, validatedIp] = authDtos.validateIp({ ip: req.ip });
    if (ipError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, ipError.message);
    }

    const token = await authServices.login(validatedBody, validatedIp.ip);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({ success: true, data: token });
  } catch (error) {
    next(error);
  }
};


export default { handleLogin };