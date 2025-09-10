import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { errorHandler } from './middleware/error.handler';
import { notFoundHandler } from './middleware/not-found.handler';
import proxy from 'koa-proxies';
import { config } from './config/config';

import root from './routers/root.router';
import auth from './routers/auth.router';
import chat from './proxy/chat.proxy';
import game from './proxy/game.proxy';

const app = new Koa();

app.use(errorHandler);
app.use(bodyParser());

app.use(root.routes()).use(root.allowedMethods());
app.use(auth.routes()).use(auth.allowedMethods());

app.use(chat);
app.use(game);

app.use(notFoundHandler);

export default app;
