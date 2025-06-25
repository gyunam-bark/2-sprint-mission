export const getUrlFromContext = (c) => c.req.url || 'unknown';

export const getBodyFromContext = async (c) => await c.req.json();

export const getParamFromContext = (c) => c.req.param();

export const getQueryFromContext = (c) => Object.fromEntries(new URL(c.req.url).searchParams.entries());
