import { Entity, Property, PrimaryKey, ManyToOne, Unique } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';

@Entity({ tableName: 'ArticleLike' })
@Unique({ properties: ['user', 'article'] })
export class ArticleLikeEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => ArticleEntity)
  article!: ArticleEntity;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
