import { Entity, Property, PrimaryKey, OneToMany, Collection } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ProductImageLinkEntity } from './product-image-link.entity';
import { ArticleImageLinkEntity } from './article-image-link.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'Image' })
export class ImageEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string' })
  url!: string;

  @Property({ type: 'string' })
  ext!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @OneToMany(() => ProductImageLinkEntity, (link) => link.image)
  productImages = new Collection<ProductImageLinkEntity>(this);

  @OneToMany(() => ArticleImageLinkEntity, (link) => link.image)
  articleImages = new Collection<ArticleImageLinkEntity>(this);

  @OneToMany(() => UserEntity, (user) => user.image)
  users = new Collection<UserEntity>(this); // 역방향 다대일
}
