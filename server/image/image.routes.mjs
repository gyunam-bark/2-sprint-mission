import express from 'express';
import { setAllowedRole } from '../middleware/auth.middleware.mjs'
import USER_ROLES from '../user/user.role.mjs'
import upload from '../upload/upload.mjs';
import * as imageControllers from './image.controllers.mjs';

const imageRouter = express.Router();

imageRouter.route('/')
  // 이미지 업로드
  .post(setAllowedRole([USER_ROLES.USER]), upload.single('upload'), imageControllers.handleCreateImage)
  // 이미지 목록
  .get(setAllowedRole([USER_ROLES.USER]), imageControllers.handleGetImageList);

imageRouter.route('/:id')
  // 이미지 정보
  .get(setAllowedRole([USER_ROLES.USER]), imageControllers.handleGetImage)
  // 이미지 완전 삭제
  .delete(setAllowedRole([USER_ROLES.MASTER]), imageControllers.handleDeleteImage);

imageRouter.route('/download/:id')
  // 이미지 다운로드
  .get(setAllowedRole([USER_ROLES.PUBLIC]), imageControllers.handleDownloadImage);

export default imageRouter;