const C_KEYWORD = 'validated';

export const getValidate = async (c) => await c.get(C_KEYWORD);
export const setValidate = async (c, validated) => await c.set(C_KEYWORD, validated);
