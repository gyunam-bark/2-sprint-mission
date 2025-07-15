import { COMMON_SORT } from '../enums/common.enum';

export type UploadImageFile = Express.Multer.File;

export type ImageParams = { id: string };

export type ImageQuery = { offset?: number; limit?: number; sort?: COMMON_SORT; keyword?: string };

export type ImageDeleteBody = { password: string };

export type GetImageListRequest = { query: ImageQuery };

export type DeleteImageRequest = { params: ImageParams; body: ImageDeleteBody };
