import Router from '@koa/router';
import { handleRefresh, handleSignIn, handleSignUp } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const auth = new Router({ prefix: '/auth' });

auth.post('/signup', handleSignUp);
auth.post('/signin', handleSignIn);
auth.post('/refresh', authMiddleware, handleRefresh);

export default auth;
