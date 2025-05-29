import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import rootRouter from './root/root.routes.mjs';
import userRouter from './user/user.routes.mjs';
import productRouter from './product/product.routes.mjs';
import articleRouter from './article/article.routes.mjs';
import authRouter from './auth/auth.routes.mjs';
import imageRouter from './image/image.routes.mjs';
import productTagRouter from './tag/product/tag.product.routes.mjs';
import articleTagRouter from './tag/article/tag.article.routes.mjs';
import productCommentRouter from './comment/product/comment.product.routes.mjs';
import articleCommentRouter from './comment/article/comment.article.routes.mjs';

import errorHandler from './middleware/error.middleware.mjs';

export default class Server {
  #app
  #port

  constructor() {
    this.#app = express();
    this.#port = process.env.EXPRESS_PORT;

    this.#initializePreMiddlewares();
    this.#initializeRoutes();
    this.#initializePostMiddlewares();
  }

  #initializePreMiddlewares() {
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(cors());
    this.#app.use(morgan('dev'));
  }

  #initializeRoutes() {
    this.#app.use('/', rootRouter);
    this.#app.use('/users', userRouter);
    this.#app.use('/products', productRouter);
    this.#app.use('/articles', articleRouter);
    this.#app.use('/images', imageRouter);
    this.#app.use('/tags/product', productTagRouter);
    this.#app.use('/tags/article', articleTagRouter);
    this.#app.use('/comments/product', productCommentRouter);
    this.#app.use('/comments/article', articleCommentRouter);
    this.#app.use('/login', authRouter);
  }

  #initializePostMiddlewares() {
    this.#app.use(errorHandler);
  }

  run() {
    this.#app.listen(
      this.#port,
      () => {
        console.log(`server is running at http://localhost:${this.#port}`);
      });
  }
}