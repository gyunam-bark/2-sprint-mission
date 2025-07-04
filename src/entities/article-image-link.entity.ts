import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ArticleEntity } from './article.entity';
import { ImageEntity } from './image.entity';

@Entity({ tableName: 'ArticleImageLink' })
export class ArticleImageLinkEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne(() => ArticleEntity)
  article!: ArticleEntity;

  @ManyToOne(() => ImageEntity)
  image!: ImageEntity;
}
