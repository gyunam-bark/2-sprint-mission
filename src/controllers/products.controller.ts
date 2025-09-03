import { RequestHandler } from 'express';
import { successResponse } from '../utils/response.util';
import {
  ActivateProductRequest,
  CreateProductRequest,
  DeactivateProductRequest,
  DeleteProductRequest,
  GetProductDetailRequest,
  GetProductListRequest,
  LikeProductRequest,
  UpdateProductRequest,
} from '../types/product.type';
import {
  activateProduct,
  createProduct,
  createProductComment,
  deactivateProduct,
  deleteProduct,
  getProductCommentList,
  getProductDetail,
  getProductList,
  likeProduct,
  updateProduct,
} from '../services/products.service';
import { getUser } from '../utils/user.util';
import { CreateProductCommentRequest, GetProductCommentListRequest } from '../types/product-comment.type';

export const handleCreateProduct: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await createProduct(user, req.validated as CreateProductRequest);

  res.status(201).json(successResponse(data));
};

export const handleGetProductList: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await getProductList(user, req.validated as GetProductListRequest);

  res.status(200).json(successResponse(data));
};

export const handleGetProductDetail: RequestHandler = async (req, res, next) => {
  const data = await getProductDetail(req.validated as GetProductDetailRequest);

  res.status(200).json(successResponse(data));
};

export const handleUpdateProduct: RequestHandler = async (req, res, next) => {
  const user = getUser(req);

  const data = await updateProduct(user, req.validated as UpdateProductRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeactivateProduct: RequestHandler = async (req, res, next) => {
  const data = await deactivateProduct(req.validated as DeactivateProductRequest);

  res.status(200).json(successResponse(data));
};

export const handleActivateProduct: RequestHandler = async (req, res, next) => {
  const data = await activateProduct(req.validated as ActivateProductRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeleteProduct: RequestHandler = async (req, res, next) => {
  const master = getUser(req);
  const data = await deleteProduct(master, req.validated as DeleteProductRequest);

  res.status(200).json(successResponse(data));
};

export const handleLikeProduct: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await likeProduct(user, req.validated as LikeProductRequest);

  res.status(200).json(successResponse(data));
};

export const handleCreateProductComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await createProductComment(user, req.validated as CreateProductCommentRequest);

  res.status(201).json(successResponse(data));
};

export const handleGetProductCommentList: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await getProductCommentList(user, req.validated as GetProductCommentListRequest);

  res.status(200).json(successResponse(data));
};
