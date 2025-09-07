import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum ResourceType {
  FILE = 'file',
  FOLDER = 'folder',
}

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ResourceType })
  type: ResourceType;

  @Column()
  name: string;

  @ManyToOne(() => Resource, (resource) => resource.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: Resource | null;

  @OneToMany(() => Resource, (resource) => resource.parent)
  children: Resource[];

  @Column({ nullable: true })
  s3Key: string;

  @Column({ nullable: true })
  mimeType?: string;

  @Column({ type: 'bigint', nullable: true })
  size?: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
