import { Entity, Property, PrimaryKey, ManyToOne, Unique } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity({ tableName: 'ProductLike' })
@Unique({ properties: ['user', 'product'] })
export class ProductLikeEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => ProductEntity)
  product!: ProductEntity;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
