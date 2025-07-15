import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from './product.entity';
import { ImageEntity } from './image.entity';

@Entity({ tableName: 'ProductImageLink' })
export class ProductImageLinkEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne(() => ProductEntity)
  product!: ProductEntity;

  @ManyToOne(() => ImageEntity)
  image!: ImageEntity;
}
