import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../users/user.entity';

export class SignupDto {
  @ApiProperty({
    example: 'test@example.com',
    description: '사용자 이메일',
  })
  email: string;

  @ApiProperty({
    example: '1234',
    description: '비밀번호',
  })
  password: string;

  @ApiProperty({
    example: UserRole.ADMIN,
    description: '사용자 역할 (기본값: USER)',
    enum: UserRole,
    enumName: 'UserRole',
    required: false,
  })
  role?: UserRole;
}

export class SigninDto {
  @ApiProperty({ example: 'test@example.com', description: '사용자 이메일' })
  email: string;

  @ApiProperty({ example: '1234', description: '비밀번호' })
  password: string;
}

export class RefreshDto {
  @ApiProperty({
    example: 'refresh_token_string',
    description: '리프레시 토큰',
  })
  refreshToken: string;
}
