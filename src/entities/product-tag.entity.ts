import { Entity, Property, PrimaryKey, Enum, ManyToMany, Collection } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { COMMON_STATUS } from '../enums/common.enum';
import { ProductEntity } from './product.entity';

@Entity({ tableName: 'ProductTag' })
export class ProductTagEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ type: 'string', unique: true })
  name!: string;

  @Enum(() => COMMON_STATUS)
  status: COMMON_STATUS = COMMON_STATUS.ACTIVE;

  @ManyToMany(() => ProductEntity, (product) => product.tags)
  products = new Collection<ProductEntity>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: Date, nullable: true })
  deletedAt?: Date;
}
