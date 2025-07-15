import { Entity, Property, PrimaryKey } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'Log' })
export class LogEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  ip!: string;

  @Property()
  url!: string;

  @Property()
  method!: string;

  @Property()
  statusCode!: string;

  @Property()
  message!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
