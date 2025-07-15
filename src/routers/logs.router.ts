import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { deleteLogSchema, getLogListSchema, validate } from '../middlewares/validate.middleware';
import { handleDeleteLog, handleGetLogList } from '../controllers/logs.controller';

const logs = express.Router();

logs.get('/', allow([USER_ROLE.MASTER]), validate(getLogListSchema), handleGetLogList);
logs.delete('/:id', allow([USER_ROLE.MASTER]), validate(deleteLogSchema), handleDeleteLog);

export default logs;
