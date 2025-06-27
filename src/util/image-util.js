export const checkImageList = async (images) => {
  let imageOption = undefined;
  if (images) {
    const imageList = await prisma.images.findMany({
      where: { id: { in: images } },
    });

    const foundImageIdList = imageList.map((image) => image.id);
    const invalidImageIdList = images.filter((id) => !foundImageIdList.includes(id));

    if (invalidImageIdList.length > 0) {
      throw new HttpError(400, `유효하지 않은 이미지가 포함 되었습니다.`);
    }
    imageOption = {
      connect: imageList.map((image) => ({ id: image.id })),
    };
  }
  return imageOption;
};
