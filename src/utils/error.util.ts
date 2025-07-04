import { ValidationError } from '@mikro-orm/core';
import { HttpError } from '../types/error.type';
import { ZodError } from 'zod/v4';

export const isErrorInstanceOfHttp = (error: any): error is HttpError => error instanceof HttpError;
export const isErrorInstanceOfNode = (error: any): error is Error => error instanceof Error;
export const isErrorInstanceOfZod = (error: any): error is ZodError => error instanceof ZodError;
export const isErrorInstanceOfMikro = (error: any): error is ValidationError => error instanceof ValidationError;
