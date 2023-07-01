import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { User } from './user.entity';
import { StoredFile } from 'src/modules/upload/object/StoredFile';
import { Comment } from 'src/entities/comment.entity';
export enum Limit {
  Public = 'Public',
  Private = 'Private',
}

@Entity({ name: 'Post' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  owner: User;

  @ApiProperty()
  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true })
  comments: Comment[];

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.posts)
  @JoinTable()
  userTags: Array<User>;

  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  @ApiProperty()
  content: object[];

  @Column({ default: Limit.Public })
  @ApiProperty()
  limit: Limit;

  @ApiProperty()
  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  @ValidateNested()
  @IsOptional()
  file?: Array<StoredFile>;

  @Column({ default: 0 })
  @ApiProperty()
  @IsNumber()
  numberTym: number;

  @Column({ default: 0 })
  @ApiProperty()
  @IsNumber()
  numberShare: number;
}
