import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { getNoticeSchema, validate } from '../middlewares/validate.middleware';
import { handleGetNoticeList } from '../controllers/users.controller';

const notices = express.Router();

// 알림 디테일 정보를 받으면, 읽은 것으로 고려
notices.get('/notices/:id', allow([USER_ROLE.USER]), validate(getNoticeSchema), handleGetNoticeList);

export default notices;
