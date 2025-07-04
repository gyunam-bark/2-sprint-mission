import { Entity, Property, PrimaryKey, ManyToOne, Unique } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';
import { ArticleCommentEntity } from './article-comment.entity';

@Entity({ tableName: 'ArticleCommentLike' })
@Unique({ properties: ['user', 'articleComment'] })
export class ArticleCommentLikeEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => ArticleCommentEntity)
  articleComment!: ArticleCommentEntity;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
