import {
  Controller,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateCommentDto } from './comment.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Put('comments/:commentId')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiResponse({ status: 200, description: '댓글이 성공적으로 수정됨' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '댓글 작성자가 아님' })
  @ApiResponse({ status: 404, description: '댓글 없음' })
  async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('User not found in request');

    const comment = await this.commentsService.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You are not the author of this comment');
    }

    return this.commentsService.updateComment(commentId, body.text);
  }

  @UseGuards(AuthGuard)
  @Delete('comments/:commentId')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiResponse({ status: 200, description: '댓글이 성공적으로 삭제됨' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '댓글 작성자가 아님' })
  @ApiResponse({ status: 404, description: '댓글 없음' })
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('User not found in request');

    const comment = await this.commentsService.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You are not the author of this comment');
    }

    await this.commentsService.deleteComment(commentId);
    return { success: true };
  }
}
