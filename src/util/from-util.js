import { getConnInfo } from '@hono/node-server/conninfo';

export const getUrlFromContext = (c) => c.req.url || 'unknown';

export const getIpFromContext = (c) => getConnInfo(c).remote.address;

export const getBodyFromContext = async (c) => await c.req.json();

export const getParamFromContext = (c) => c.req.param();

export const getQueryFromContext = (c) => Object.fromEntries(new URL(c.req.url).searchParams.entries());

export const getFormDataFromContext = async (c) => await c.req.formData();

export const getFileFromContext = async (c, field) => await getFormDataFromContext(c).get(field);

export const getImageFromContext = async (c) => (await getFormDataFromContext(c)).get('image');
