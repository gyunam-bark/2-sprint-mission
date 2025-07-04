import { Entity, Property, PrimaryKey, Enum, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { COMMON_STATUS } from '../enums/common.enum';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';
import { ArticleCommentLikeEntity } from './article-comment-like.entity';

@Entity({ tableName: 'ArticleComment' })
export class ArticleCommentEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ type: 'string' })
  content!: string;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => ArticleEntity)
  article!: ArticleEntity;

  @Enum(() => COMMON_STATUS)
  status: COMMON_STATUS = COMMON_STATUS.ACTIVE;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: Date, nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => ArticleCommentLikeEntity, (like) => like.articleComment)
  likes = new Collection<ArticleCommentLikeEntity>(this);
}
