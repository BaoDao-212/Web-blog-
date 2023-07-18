import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';
import { IsOptional, ValidateNested } from 'class-validator';
import { StoredFile } from 'src/modules/upload/object/StoredFile';

@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @ManyToOne(() => User, (owner) => owner.comments)
  @JoinColumn()
  owner: User;

  @ApiProperty()
  @ManyToOne(() => Post, (post) => post.owner)
  @JoinColumn()
  post: Post;

  @Column()
  @ApiProperty()
  contentComment: string;

  @ApiProperty()
  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  @ValidateNested()
  @IsOptional()
  file?: Array<StoredFile>;
}
