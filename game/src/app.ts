import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { errorHandler } from './middleware/error.handler';
import root from './routers/root.router';
import players from './routers/player.router';
import { notFoundHandler } from './middleware/not-found.handler';

const app = new Koa();

app.use(errorHandler);
app.use(bodyParser());

app.use(root.routes()).use(root.allowedMethods());
app.use(players.routes()).use(players.allowedMethods());

app.use(notFoundHandler);

export default app;
