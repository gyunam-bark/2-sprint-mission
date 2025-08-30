import { COMMON_SORT } from '../enums/common.enum';

export type NotificationParams = { id: string };

export type NotificationListQuery = { offset?: number; limit?: number; sort?: COMMON_SORT };

export type GetNotificationListRequest = { query: NotificationListQuery };

export type GetNotificationRequest = { params: NotificationParams };

export type ReadNotificationRequest = { params: NotificationParams };
