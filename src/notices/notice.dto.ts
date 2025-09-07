import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeDto {
  @ApiProperty({ example: '서비스 점검 안내', description: '공지사항 제목' })
  title: string;

  @ApiProperty({
    example: '2025년 9월 10일 02:00~05:00 동안 서비스 점검이 진행됩니다.',
    description: '공지사항 내용',
  })
  content: string;
}

export class UpdateNoticeDto {
  @ApiProperty({
    example: '서비스 점검 일정 변경',
    description: '공지사항 제목',
  })
  title: string;

  @ApiProperty({
    example: '점검 시간이 2025년 9월 11일 02:00~04:00로 변경되었습니다.',
    description: '공지사항 내용',
  })
  content: string;
}

export class NoticeResponseDto {
  @ApiProperty({ example: 1, description: '공지사항 ID' })
  id: number;

  @ApiProperty({ example: '서비스 점검 안내', description: '공지사항 제목' })
  title: string;

  @ApiProperty({
    example: '2025년 9월 10일 02:00~05:00 동안 서비스 점검이 진행됩니다.',
    description: '공지사항 내용',
  })
  content: string;

  @ApiProperty({ example: '2025-09-07T12:34:56.000Z', description: '작성일' })
  createdAt: Date;

  @ApiProperty({ example: '2025-09-07T12:34:56.000Z', description: '수정일' })
  updatedAt: Date;
}
