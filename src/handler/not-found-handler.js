export const notFoundHandler = (c) => {
  return c.json(
    {
      success: false,
      message: '요청하신 페이지를 찾을 수 없습니다.',
    },
    404
  );
};
