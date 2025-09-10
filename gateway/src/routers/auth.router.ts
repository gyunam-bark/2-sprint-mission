import Router from '@koa/router';
import { handleRefresh, handleSignIn, handleSignUp } from '../controllers/auth.controller';

const auth = new Router({ prefix: '/auth' });

auth.post('/signup', handleSignUp);
auth.post('/signin', handleSignIn);
auth.post('/refresh', handleRefresh);

export default auth;
