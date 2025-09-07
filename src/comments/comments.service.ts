import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { Resource } from '../resources/resource.entity';
import { CommentsGateway } from './comments.gateway';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @Inject(forwardRef(() => CommentsGateway))
    private commentsGateway: CommentsGateway,

    @InjectRepository(Resource)
    private resourceRepo: Repository<Resource>,

    private usersService: UsersService,
  ) {}

  async addComment(text: string, user: User, resource: Resource) {
    const author = await this.usersService.findById(user.id);
    if (!author) throw new NotFoundException('User not found');

    const resourceEntity = await this.resourceRepo.findOne({
      where: { id: resource.id },
    });
    if (!resourceEntity) {
      throw new NotFoundException(`Resource ${resource.id} not found`);
    }

    const comment = this.commentRepo.create({
      text,
      author,
      resource: resourceEntity,
    });

    const savedComment = await this.commentRepo.save(comment);
    await this.commentsGateway.notifyNewComment(savedComment);

    return savedComment;
  }

  async getComments(resourceId: number) {
    return this.commentRepo.find({
      where: { resource: { id: resourceId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number) {
    return this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'resource'],
    });
  }

  async updateComment(id: number, text: string) {
    await this.commentRepo.update(id, { text });
    const updated = await this.findById(id);

    if (!updated) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    if (updated.resource) {
      await this.commentsGateway.notifyUpdateComment(updated);
    }

    return updated;
  }

  async deleteComment(id: number) {
    const comment = await this.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    await this.commentRepo.delete(id);

    if (comment.resource) {
      await this.commentsGateway.notifyDeleteComment(
        comment.id,
        comment.resource.id,
      );
    }
  }
}
