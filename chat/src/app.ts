import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import rootRouter from './routers/root.router';
import { errorHandler } from './middleware/error.handler';
import { notFoundHandler } from './middleware/not-found.handler';
import messages from './routers/message.router';

const app = new Koa();

app.use(errorHandler);
app.use(bodyParser());

app.use(rootRouter.routes()).use(rootRouter.allowedMethods());
app.use(messages.routes()).use(messages.allowedMethods());

app.use(notFoundHandler);

export default app;
