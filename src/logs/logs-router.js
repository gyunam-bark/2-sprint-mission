import { Hono } from 'hono';
import { allow } from '../middleware/role-middleware.js';
import { USER_ROLE } from '../constant/constant.js';
import { deleteLogSchema, getLogListSchema, validate } from '../middleware/validate-middleware.js';
import { handleDeleteLog, handleGetLogList } from './logs-controller.js';

const logs = new Hono();

logs.get('/', allow([USER_ROLE.MASTER]), validate(getLogListSchema), handleGetLogList);
logs.delete('/:id', allow([USER_ROLE.MASTER]), validate(deleteLogSchema), handleDeleteLog);

export default logs;
