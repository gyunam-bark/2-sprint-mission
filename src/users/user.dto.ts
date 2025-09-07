import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  id: number;

  @ApiProperty({ example: 'test@test.com', description: '사용자 이메일' })
  email: string;

  @ApiProperty({ example: '2025-09-07T12:00:00.000Z', description: '생성일' })
  createdAt: Date;

  @ApiProperty({ example: '2025-09-07T12:00:00.000Z', description: '수정일' })
  updatedAt: Date;
}

export class DeleteUserResponseDto {
  @ApiProperty({ example: true, description: '삭제 성공 여부' })
  success: boolean;
}
