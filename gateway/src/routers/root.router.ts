import Router from 'koa-router';
import { handleGetHealthCheck } from '../controllers/auth.controller';

const router = new Router();

router.get('/', handleGetHealthCheck);

export default router;
