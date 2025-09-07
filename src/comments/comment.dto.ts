import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ example: '수정된 댓글 내용', description: '댓글 텍스트' })
  text: string;
}
