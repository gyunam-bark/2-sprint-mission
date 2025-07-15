import ENV from './config/env.js';
import { Hono } from 'hono';
import { poweredBy } from 'hono/powered-by';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import rootRoute from './root/root-router.js';
import authRoute from './auth/auth-router.js';
import usersRoute from './users/users-router.js';
import imagesRoute from './images/images-router.js';
import productsRoute from './products/products-router.js';
import articlesRoute from './articles/articles-router.js';
import commentsRoute from './comments/comments-router.js';
import logsRoute from './logs/logs-router.js';
import { notFoundHandler } from './handler/not-found-handler.js';
import { errorHandler } from './handler/error-handler.js';

const app = new Hono();

// PRE MIDDLEWARES
app.use(poweredBy());
app.use(logger());

// ROUTES
app.route('/', rootRoute);
app.route('/auth', authRoute);
app.route('/users', usersRoute);
app.route('/images', imagesRoute);
app.route('/products', productsRoute);
app.route('/articles', articlesRoute);
app.route('/comments', commentsRoute);
app.route('/logs', logsRoute);

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
