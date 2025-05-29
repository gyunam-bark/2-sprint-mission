import HTTP_STATUSES from '../common/http.status.mjs';
import { errorWithStatus } from '../util/error.util.mjs';
import * as productDtos from './product.dto.mjs';
import * as productServices from './product.services.mjs'

// GET /PRODUCTS
export const handleGetProductList = async (req, res, next) => {
  try {
    const [getError, validatedQuery] = productDtos.validateGetProductList(req.query);
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const productList = await productServices.getProductList(validatedQuery, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: productList
    });
  } catch (error) {
    next(error);
  }
}

export const handleGetProduct = async (req, res, next) => {
  try {
    const [getError, validatedParams] = productDtos.validateGetProduct({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const product = await productServices.getProduct(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
}

export const handleCreateProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    const [createError, validatedBody] = productDtos.validateCreateProduct(req.body);
    if (createError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, createError.message);
    }

    const createdProduct = await productServices.createProduct(validatedBody, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: createdProduct
    });
  } catch (error) {
    next(error);
  }
}

export const handleUpdateProduct = async (req, res, next) => {
  try {
    const [getError, validatedParams] = productDtos.validateGetProduct({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const [updateError, validatedBody] = productDtos.validateUpdateProduct(req.body, req.user);
    if (updateError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, updateError.message);
    }

    const updatedProduct = await productServices.updateProduct(validatedParams, validatedBody, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
}

export const handleDeactivateProduct = async (req, res, next) => {
  try {
    const [getError, validatedParams] = productDtos.validateDeactivateProduct({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const deactivatedProduct = await productServices.deactivateProduct(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deactivatedProduct
    });
  } catch (error) {
    next(error);
  }
}

export const handleActivateProduct = async (req, res, next) => {
  try {
    const [getError, validatedParams] = productDtos.validateActivateProduct({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const activatedProduct = await productServices.activateProduct(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: activatedProduct
    });
  } catch (error) {
    next(error);
  }
}

export const handleDeleteProduct = async (req, res, next) => {
  try {
    const [getError, validatedParams] = productDtos.validateDeleteProduct({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const deletedProduct = await productServices.deleteProduct(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deletedProduct
    });
  } catch (error) {
    next(error);
  }
}