import { COMMON_SORT } from '../enums/common.enum';

export type LogParams = { id: string };

export type LogDeleteBody = { password: string };

export type LogQuery = { offset?: number; limit?: number; sort?: COMMON_SORT; keyword?: string };

export type GetLogListRequest = { query: LogQuery };

export type DeleteLogRequest = { params: LogParams; body: LogDeleteBody };
