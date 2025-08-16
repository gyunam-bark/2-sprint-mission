import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'Notification' })
export class NotificationEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  message!: string;

  @Property({ default: false })
  isRead: boolean = false;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date() })
  deletedAt: Date = new Date();

  @Property({ type: Date, nullable: true })
  readAt?: Date | null;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;
}
