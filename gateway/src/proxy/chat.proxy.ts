import proxy from 'koa-proxies';
import Router from '@koa/router';

const chatProxy = new Router();

chatProxy.all(
  '/chat/(.*)',
  proxy('/chat', {
    target: process.env.CHAT_SERVICE_URL || 'http://localhost:3001',
    ws: true,
    changeOrigin: true,
    logs: true,
  })
);

export default chatProxy;
