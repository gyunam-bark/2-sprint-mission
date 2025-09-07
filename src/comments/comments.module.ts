import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsGateway } from './comments.gateway';
import { User } from '../users/user.entity';
import { Resource } from '../resources/resource.entity';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ResourcesModule } from '../resources/resources.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Resource]),
    UsersModule,
    ConfigModule,
    forwardRef(() => ResourcesModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsGateway],
  exports: [CommentsService],
})
export class CommentsModule {}
