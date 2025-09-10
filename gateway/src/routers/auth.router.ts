import Router from '@koa/router';
import { handleSignIn, handleSignUp } from '../controllers/auth.controller';

const auth = new Router({ prefix: '/auth' });

auth.post('/signup', handleSignUp);
auth.post('/signin', handleSignIn);

export default auth;
