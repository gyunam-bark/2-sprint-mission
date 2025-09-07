import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Resource } from './resource.entity';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { S3Client } from '@aws-sdk/client-s3';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
    ConfigModule,
    UsersModule,
    forwardRef(() => CommentsModule),
  ],
  controllers: [ResourcesController],
  providers: [
    {
      provide: 'S3_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new S3Client({
          region: config.get<string>('AWS_REGION', 'ap-northeast-2'),
          credentials: {
            accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID', ''),
            secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY', ''),
          },
        });
      },
    },
    ResourcesService,
  ],
  exports: [ResourcesService],
})
export class ResourcesModule {}
