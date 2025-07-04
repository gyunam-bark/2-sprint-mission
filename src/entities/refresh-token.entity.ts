import { Entity, Property, PrimaryKey, ManyToOne, Unique } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'RefreshToken' })
@Unique({ properties: ['user'] })
export class RefreshTokenEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ type: 'string' })
  token!: string;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: Date })
  expiresAt!: Date;
}
