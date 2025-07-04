import { Entity, Property, PrimaryKey, Enum, ManyToMany, Collection } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { COMMON_STATUS } from '../enums/common.enum';
import { ArticleEntity } from './article.entity';

@Entity({ tableName: 'ArticleTag' })
export class ArticleTagEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ type: 'string', unique: true })
  name!: string;

  @Enum(() => COMMON_STATUS)
  status: COMMON_STATUS = COMMON_STATUS.ACTIVE;

  @ManyToMany(() => ArticleEntity, (article) => article.tags)
  articles = new Collection<ArticleEntity>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: Date, nullable: true })
  deletedAt?: Date;
}
