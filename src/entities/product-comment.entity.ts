import { Entity, Property, PrimaryKey, Enum, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { COMMON_STATUS } from '../enums/common.enum';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';
import { ProductCommentLikeEntity } from './product-comment-like.entity';

@Entity({ tableName: 'ProductComment' })
export class ProductCommentEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ type: 'string' })
  content!: string;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => ProductEntity)
  product!: ProductEntity;

  @Enum(() => COMMON_STATUS)
  status: COMMON_STATUS = COMMON_STATUS.ACTIVE;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: Date, nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => ProductCommentLikeEntity, (like) => like.productComment)
  likes = new Collection<ProductCommentLikeEntity>(this);
}
