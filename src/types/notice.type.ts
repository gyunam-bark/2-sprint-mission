import { COMMON_SORT } from '../enums/common.enum';

export type NoticeListParams = { id?: string };

export type NoticeListQuery = { offset?: number; limit?: number; sort?: COMMON_SORT };

export type GetNoticeListRequest = { params: NoticeListParams; query: NoticeListQuery };

export type GetNoticeRequest = { params: NoticeListParams };
