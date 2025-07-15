import { Entity, Property, PrimaryKey, Enum, ManyToOne, OneToMany, ManyToMany, Collection } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { COMMON_STATUS } from '../enums/common.enum';
import { UserEntity } from './user.entity';
import { ArticleTagEntity } from './article-tag.entity';
import { ArticleImageLinkEntity } from './article-image-link.entity';
import { ArticleCommentEntity } from './article-comment.entity';
import { ArticleLikeEntity } from './article-like.entity';

@Entity({ tableName: 'Article' })
export class ArticleEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ type: 'string' })
  title!: string;

  @Property({ type: 'string' })
  content!: string;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToMany(() => ArticleTagEntity, (tag) => tag.articles, { owner: true })
  tags = new Collection<ArticleTagEntity>(this);

  @Enum(() => COMMON_STATUS)
  status: COMMON_STATUS = COMMON_STATUS.ACTIVE;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: Date, nullable: true })
  deletedAt?: Date;

  @OneToMany(() => ArticleImageLinkEntity, (link) => link.article)
  images = new Collection<ArticleImageLinkEntity>(this);

  @OneToMany(() => ArticleCommentEntity, (comment) => comment.article)
  comments = new Collection<ArticleCommentEntity>(this);

  @OneToMany(() => ArticleLikeEntity, (like) => like.article)
  likes = new Collection<ArticleLikeEntity>(this);
}
