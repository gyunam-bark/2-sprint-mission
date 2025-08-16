import { Entity, Property, PrimaryKey, Enum, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ImageEntity } from './image.entity';
import { ProductEntity } from './product.entity';
import { ArticleEntity } from './article.entity';
import { ProductCommentEntity } from './product-comment.entity';
import { ArticleCommentEntity } from './article-comment.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { ProductLikeEntity } from './product-like.entity';
import { ArticleLikeEntity } from './article-like.entity';
import { ProductCommentLikeEntity } from './product-comment-like.entity';
import { ArticleCommentLikeEntity } from './article-comment-like.entity';
import { USER_STATUS, USER_ROLE } from '../enums/user.enum';
import { NotificationEntity } from './notification.entity';

@Entity({ tableName: 'User' })
export class UserEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ type: 'string' })
  nickname!: string;

  @Property({ type: 'string', unique: true })
  email!: string;

  @Property({ type: 'string' })
  password!: string;

  @Enum(() => USER_STATUS)
  status: USER_STATUS = USER_STATUS.ACTIVE;

  @Enum(() => USER_ROLE)
  role: USER_ROLE = USER_ROLE.USER;

  @ManyToOne(() => ImageEntity, { nullable: true })
  image?: ImageEntity | null;

  @Property({ default: false })
  isArchiveUser: boolean = false;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: Date, nullable: true })
  deletedAt?: Date | null;

  @Property({ type: Date, nullable: true })
  lastLoginAt?: Date | null;

  @Property({ type: 'string', nullable: true })
  lastLoginIp?: string | null;

  @Property({ default: 0 })
  loginAttempts: number = 0;

  @OneToMany(() => ProductEntity, (product) => product.user)
  products = new Collection<ProductEntity>(this);

  @OneToMany(() => ArticleEntity, (article) => article.user)
  articles = new Collection<ArticleEntity>(this);

  @OneToMany(() => ProductCommentEntity, (comment) => comment.user)
  productComments = new Collection<ProductCommentEntity>(this);

  @OneToMany(() => ArticleCommentEntity, (comment) => comment.user)
  articleComments = new Collection<ArticleCommentEntity>(this);

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens = new Collection<RefreshTokenEntity>(this);

  @OneToMany(() => ProductLikeEntity, (like) => like.user)
  productLikes = new Collection<ProductLikeEntity>(this);

  @OneToMany(() => ArticleLikeEntity, (like) => like.user)
  articleLikes = new Collection<ArticleLikeEntity>(this);

  @OneToMany(() => ProductCommentLikeEntity, (like) => like.user)
  productCommentLikes = new Collection<ProductCommentLikeEntity>(this);

  @OneToMany(() => ArticleCommentLikeEntity, (like) => like.user)
  articleCommentLikes = new Collection<ArticleCommentLikeEntity>(this);

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications = new Collection<NotificationEntity>(this);
}
