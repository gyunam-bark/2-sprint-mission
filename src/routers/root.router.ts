import express from 'express';
import { handleGetHealthCheck } from '../controllers/root.controller';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import { getHealthCheckSchema, validate } from '../middlewares/validate.middleware';

const root = express.Router();

root.get('/', allow([USER_ROLE.NONE]), validate(getHealthCheckSchema), handleGetHealthCheck);

export default root;
