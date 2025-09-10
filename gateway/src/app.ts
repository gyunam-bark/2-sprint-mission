import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import root from './routers/root.router';

const app = new Koa();

app.use(bodyParser());
app.use(root.routes()).use(root.allowedMethods());

export default app;
