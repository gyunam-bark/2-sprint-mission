import ENV from './config/env.js';
import { Hono } from 'hono';
import { poweredBy } from 'hono/powered-by';
import { logger } from 'hono/logger';
import { errorHandler } from './handler/error-handler.js';
import { serve } from '@hono/node-server';
import rootRoute from './root/root-router.js';
import authRoute from './auth/auth-router.js';
import { notFoundHandler } from './handler/not-found-handler.js';
import usersRoute from './users/users-router.js';

const app = new Hono();

// PRE MIDDLEWARES
app.use(poweredBy());
app.use(logger());

// ROUTES
app.route('/', rootRoute);
app.route('/auth', authRoute);
app.route('/users', usersRoute);

// 404 NOT FOUND HANDLER
app.notFound(notFoundHandler);
// GLOBAL ERROR HANDLER
app.onError(errorHandler);

serve(
  {
    fetch: app.fetch,
    port: ENV.PORT,
  },
  (info) => console.log(info)
);
