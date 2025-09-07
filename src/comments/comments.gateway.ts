import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
  ) {}

  // 클라이언트가 특정 리소스의 댓글 방에 들어옴
  @SubscribeMessage('joinResource')
  handleJoin(
    @MessageBody() resourceId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(String(resourceId));
    client.emit('joined', resourceId);
  }

  // 새 댓글 알림
  async notifyNewComment(comment: Comment) {
    this.server.to(String(comment.resource.id)).emit('newComment', comment);
  }

  // 댓글 수정 알림
  async notifyUpdateComment(comment: Comment) {
    this.server.to(String(comment.resource.id)).emit('updateComment', comment);
  }

  // 댓글 삭제 알림
  async notifyDeleteComment(commentId: number, resourceId: number) {
    this.server.to(String(resourceId)).emit('deleteComment', { id: commentId });
  }
}
