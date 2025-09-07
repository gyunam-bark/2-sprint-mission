import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ example: '내 문서', description: '폴더 이름' })
  name: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: '부모 폴더 ID (없으면 루트)',
  })
  parentId?: number;
}

export class CreateFileDto {
  @ApiProperty({ example: 'document.txt', description: '파일 이름' })
  name: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: '부모 폴더 ID (없으면 루트)',
  })
  parentId?: number;
}

export class AddCommentDto {
  @ApiProperty({ example: '좋은 문서네요!', description: '댓글 텍스트' })
  text: string;
}
