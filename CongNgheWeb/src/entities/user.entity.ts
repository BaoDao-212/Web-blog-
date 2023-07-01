import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { compare, hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { StoredFile } from 'src/modules/upload/object/StoredFile';
import { IsOptional, ValidateNested } from 'class-validator';
import { Post } from './post.entity';
import { Comment } from 'src/entities/comment.entity';
import { Type } from 'class-transformer';
export enum Position {
  Admin = 'Admin',
  Student = 'Student',
  Professor = 'Professor',
}
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ nullable: true })
  @ApiProperty()
  department?: string;

  @ApiProperty({ type: StoredFile })
  @Column('json', { nullable: true })
  @ValidateNested()
  @IsOptional()
  @Type(() => StoredFile)
  avatar?: StoredFile;

  @Column()
  @ApiProperty()
  name?: string;

  @ApiProperty()
  @OneToMany(() => Comment, (comment) => comment.owner, {
    nullable: true,
  })
  comments?: Comment[];

  @ApiProperty()
  @ManyToMany(() => Post, (post) => post.userTags, { nullable: true })
  tagsPost?: Post[];

  @ApiProperty()
  @OneToMany(() => Post, (post) => post.owner, { nullable: true })
  posts?: Post[];

  @Column()
  @ApiProperty()
  username: string;

  @Column({ nullable: true })
  @ApiProperty()
  password?: string;

  @Column('enum', {
    enum: Position,
    default: Position.Student,
  })
  @ApiProperty()
  position?: Position;

  @Column({ nullable: true, default: '', unique: true })
  @ApiProperty()
  email?: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  phone?: string;

  // phương thức xử lí password
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    this.password = await hash(this.password, 12);
  }

  async checkPassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}
