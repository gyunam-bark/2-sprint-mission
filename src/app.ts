import express from 'express';
import './types/express.type';
import cookieParser from 'cookie-parser';
import { listenHandler } from './handlers/listen.handler';
import { notFoundHandler } from './handlers/not-found.handler';
import { globalErrorHandler } from './handlers/global-error.handler';
import root from './routers/root.router';
import auth from './routers/auth.router';
import users from './routers/users.router';
import images from './routers/images.router';
import products from './routers/products.router';
import articles from './routers/articles.router';
import comments from './routers/comments.router';
import logs from './routers/logs.router';
import docs from './routers/docs.router';

const app = express();

// PRE MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTERS
app.use('/', root);
app.use('/v1/auth', auth);
app.use('/v1/users', users);
app.use('/v1/images', images);
app.use('/v1/products', products);
app.use('/v1/articles', articles);
app.use('/v1/comments', comments);
app.use('/v1/logs', logs);
app.use('/v1/docs', docs);

// POST MIDDLEWARE
app.use(notFoundHandler);
app.use(globalErrorHandler);

// LISTEN
app.listen(3000, listenHandler);
