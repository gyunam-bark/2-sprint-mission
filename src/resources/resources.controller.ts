import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
  ParseIntPipe,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CommentsService } from '../comments/comments.service';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { Resource } from './resource.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateFolderDto, CreateFileDto, AddCommentDto } from './resource.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Resources')
@ApiBearerAuth()
@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly commentsService: CommentsService,
  ) {}

  private getUserOrThrow(req: Request) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('User not found in request');
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('folders')
  @ApiOperation({ summary: '폴더 생성' })
  @ApiResponse({ status: 201, description: '폴더 생성 완료' })
  async createFolder(@Body() body: CreateFolderDto, @Req() req: Request) {
    const user = this.getUserOrThrow(req);
    return this.resourcesService.createFolder(
      body.name,
      body.parentId || null,
      user,
    );
  }

  @UseGuards(AuthGuard)
  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '파일 업로드 (DB 생성 + S3 업로드)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: '파일 업로드 완료' })
  async uploadFile(
    @Body('name') name: string,
    @Body('parentId') parentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const user = this.getUserOrThrow(req);
    return this.resourcesService.createAndUploadFile(
      name,
      parentId ? Number(parentId) : null,
      file,
      user,
    );
  }

  @UseGuards(AuthGuard)
  @Get('trash')
  @ApiOperation({ summary: '휴지통 목록 조회' })
  @ApiResponse({ status: 200, description: '휴지통 리소스 목록 반환' })
  async getTrash(@Req() req: Request) {
    const user = this.getUserOrThrow(req);
    return this.resourcesService.getTrash(user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: '리소스 조회' })
  @ApiResponse({ status: 200, description: '리소스 반환' })
  async getResource(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getResource(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/download')
  @ApiOperation({ summary: '파일 다운로드 URL 조회' })
  @ApiResponse({ status: 200, description: '파일 다운로드 presigned URL 반환' })
  async getDownloadUrl(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.getDownloadUrl(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/comments')
  @ApiOperation({ summary: '리소스에 댓글 추가' })
  @ApiResponse({ status: 201, description: '댓글 작성 완료' })
  async addComment(
    @Param('id', ParseIntPipe) resourceId: number,
    @Body() body: AddCommentDto,
    @Req() req: Request,
  ) {
    const user = this.getUserOrThrow(req);
    const resource = { id: resourceId } as Resource;
    return this.commentsService.addComment(body.text, user, resource);
  }

  @UseGuards(AuthGuard)
  @Get(':id/comments')
  @ApiOperation({ summary: '리소스의 댓글 조회' })
  @ApiResponse({ status: 200, description: '댓글 목록 반환' })
  async getComments(@Param('id', ParseIntPipe) resourceId: number) {
    return this.commentsService.getComments(resourceId);
  }

  @UseGuards(AuthGuard)
  @Post(':id/trash')
  @HttpCode(200)
  @ApiOperation({ summary: '리소스를 휴지통으로 이동' })
  @ApiResponse({ status: 200, description: '리소스가 휴지통으로 이동됨' })
  async moveToTrash(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = this.getUserOrThrow(req);
    return this.resourcesService.moveToTrash(id, user);
  }

  @UseGuards(AuthGuard)
  @Post(':id/restore')
  @HttpCode(200)
  @ApiOperation({ summary: '휴지통에서 리소스 복원' })
  @ApiResponse({ status: 200, description: '리소스 복원 완료' })
  async restore(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = this.getUserOrThrow(req);
    return this.resourcesService.restore(id, user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/permanent')
  @HttpCode(200)
  @ApiOperation({ summary: '휴지통에서 리소스 영구 삭제' })
  @ApiResponse({ status: 200, description: '리소스 영구 삭제 완료' })
  async permanentlyDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = this.getUserOrThrow(req);
    return this.resourcesService.permanentlyDelete(id, user);
  }
}
