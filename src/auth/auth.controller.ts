import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignupDto, SigninDto, RefreshDto } from './auth.dto';
import { UserRole } from '../users/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(
      dto.email,
      dto.password,
      dto.role ?? UserRole.USER,
    );
  }

  @Post('signin')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 201,
    description: '로그인 성공, access/refresh 토큰 반환',
  })
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: '리프레시 토큰으로 access 토큰 재발급' })
  @ApiResponse({ status: 201, description: '새로운 access 토큰 반환' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}
