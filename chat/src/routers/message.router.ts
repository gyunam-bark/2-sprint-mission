import Router from '@koa/router';
import { handleGetMessages } from '../controllers/message.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const messages = new Router({ prefix: '/messages' });

// 인증된 사용자만 접근 가능
messages.get('/', authMiddleware, handleGetMessages);

export default messages;
