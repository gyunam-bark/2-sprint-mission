import USER_ROLE from '../common/user-role.js';

const C_KEYWORD = 'user';

export const getUser = async (c) => await c.get(C_KEYWORD);
export const setUser = async (c, payload) => await c.set(C_KEYWORD, payload);
export const isUserMaster = (user) => user.role === USER_ROLE.MASTER;
export const isUserOwner = (requestIp, ownerIp) => requestIp === ownerIp;
