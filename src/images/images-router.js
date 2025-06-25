import { Hono } from 'hono';
import { allow } from '../middleware/role-middleware.js';
import { handleUploadImage } from './images-controller.js';
import USER_ROLE from '../common/user-role.js';

const images = new Hono();

images.post('/', allow([USER_ROLE.USER]), handleUploadImage);

export default images;
