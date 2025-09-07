import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserResponseDto, DeleteUserResponseDto } from './user.dto';
import { User } from './user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: '사용자 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 반환',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user: User | null = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({
    status: 200,
    description: '사용자 삭제 성공',
    type: DeleteUserResponseDto,
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteUserResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.deleteUser(id);
    return { success: true };
  }
}
