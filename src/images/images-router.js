import { Hono } from 'hono';
import { allow } from '../middleware/role-middleware.js';
import { handleDeleteImage, handleUploadImage } from './images-controller.js';
import { USER_ROLE } from '../constant/constant.js';
import { deleteImageSchema, validate } from '../middleware/validate-middleware.js';

const images = new Hono();

images.post('/', allow([USER_ROLE.USER]), handleUploadImage);
images.delete('/:id', allow([USER_ROLE.MASTER]), validate(deleteImageSchema), handleDeleteImage);

export default images;
