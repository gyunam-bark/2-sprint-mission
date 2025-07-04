import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { deleteImageSchema, getImageListSchema, uploadImageSchema, validate } from '../middlewares/validate.middleware';
import { handleDeleteImage, handleGetImageList, handleUploadImage } from '../controllers/images.controller';
import { upload } from '../middlewares/upload.middleware';

const images = express.Router();

images.post('/', allow([USER_ROLE.USER]), upload.single('image'), validate(uploadImageSchema), handleUploadImage);
images.get('/', allow([USER_ROLE.MASTER]), validate(getImageListSchema), handleGetImageList);
images.delete('/:id', allow([USER_ROLE.MASTER]), validate(deleteImageSchema), handleDeleteImage);

export default images;
