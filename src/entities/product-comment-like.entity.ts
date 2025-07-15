import { Entity, Property, PrimaryKey, ManyToOne, Unique } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';
import { ProductCommentEntity } from './product-comment.entity';

@Entity({ tableName: 'ProductCommentLike' })
@Unique({ properties: ['user', 'productComment'] })
export class ProductCommentLikeEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => ProductCommentEntity)
  productComment!: ProductCommentEntity;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
