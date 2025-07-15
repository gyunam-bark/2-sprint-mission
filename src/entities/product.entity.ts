import { Entity, Property, PrimaryKey, Enum, ManyToOne, OneToMany, ManyToMany, Collection } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { PRODUCT_STATUS } from '../enums/product.enum';
import { UserEntity } from './user.entity';
import { ProductTagEntity } from './product-tag.entity';
import { ProductCommentEntity } from './product-comment.entity';
import { ProductLikeEntity } from './product-like.entity';
import { ProductImageLinkEntity } from './product-image-link.entity';

@Entity({ tableName: 'Product' })
export class ProductEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string' })
  description!: string;

  @Property({ default: 1 })
  price: number = 1;

  @Property({ default: 1 })
  stock: number = 1;

  @ManyToMany(() => ProductTagEntity, (tag) => tag.products, { owner: true })
  tags = new Collection<ProductTagEntity>(this);

  @Enum(() => PRODUCT_STATUS)
  status: PRODUCT_STATUS = PRODUCT_STATUS.ACTIVE;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: Date, nullable: true })
  deletedAt?: Date;

  @OneToMany(() => ProductImageLinkEntity, (link) => link.product)
  images = new Collection<ProductImageLinkEntity>(this);

  @OneToMany(() => ProductCommentEntity, (comment) => comment.product)
  comments = new Collection<ProductCommentEntity>(this);

  @OneToMany(() => ProductLikeEntity, (like) => like.product)
  likes = new Collection<ProductLikeEntity>(this);
}
