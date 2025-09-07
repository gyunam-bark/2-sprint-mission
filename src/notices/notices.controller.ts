import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import {
  CreateNoticeDto,
  UpdateNoticeDto,
  NoticeResponseDto,
} from './notice.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Notices')
@Controller('notices')
@UseGuards(AuthGuard, RolesGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '공지사항 생성 (관리자 전용)' })
  @ApiResponse({ status: 201, type: NoticeResponseDto })
  create(@Body() body: CreateNoticeDto) {
    return this.noticesService.create(body.title, body.content);
  }

  @Get()
  @ApiOperation({ summary: '공지사항 전체 조회' })
  @ApiResponse({ status: 200, type: [NoticeResponseDto] })
  findAll() {
    return this.noticesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '공지사항 단일 조회' })
  @ApiResponse({ status: 200, type: NoticeResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.noticesService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '공지사항 수정 (관리자 전용)' })
  @ApiResponse({ status: 200, type: NoticeResponseDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateNoticeDto) {
    return this.noticesService.update(id, body.title, body.content);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '공지사항 삭제 (관리자 전용)' })
  @ApiResponse({ status: 200, schema: { example: { success: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noticesService.remove(id);
  }
}
