import { object, validate } from 'superstruct';
import { Email, Password, Ip } from '../common/common.dto.mjs';

/*  
 * 검증 객체
 */

// LOGIN(email, password)
const LoginUser = object({
  email: Email,
  password: Password,
});

// IP(ip)
const LoginIp = object({
  ip: Ip
});


/*  
 * 외부 공개용 메서드
 */

export const validateLogin = (data) => validate(data, LoginUser);
export const validateIp = (ip) => validate(ip, LoginIp);