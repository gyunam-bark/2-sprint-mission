import { Hono } from 'hono';
import { handleHealthCheck } from './root-controller.js';

const root = new Hono();

root.get('/', handleHealthCheck);

export default root;
