import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Limit, Post } from 'src/entities/post.entity';
import { CoreOutput } from 'src/modules/common/output.dto';
import { StoredFile } from '../upload/object/StoredFile';
import { Type } from 'class-transformer';
import { object } from 'joi';

export class CreatePostInput {
  @ApiProperty({ description: 'users are tagged id of post' })
  userTagsId: Array<number>;

  @ApiProperty({ description: 'content of this post' })
  content: object[];
  @ApiProperty({
    description: 'limit user can see of this post',
  })
  @IsString()
  limit: Limit;

  @ApiProperty({
    description: 'limit user can see this post of this lesson',
    type: [StoredFile],
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => StoredFile)
  file?: StoredFile[];
}

export class CreatePostOutput extends CoreOutput {}
//xóa bài đăng
export class DeletePostInput {
  @ApiProperty({ description: 'post id  of post delete' })
  @IsNumber()
  postId: number;
}
export class DeletePostOutput extends CoreOutput {}
//thay đổi bài đăng
export class UpdatePostInput {
  @ApiProperty({ description: 'post id  of post Update' })
  @IsNumber()
  postId: number;

  @ApiProperty({ description: 'users are tagged id of post' })
  @IsNumber()
  userTagsId?: number[];

  @ApiProperty({ description: 'content of this post', type: object })
  @Type(() => object)
  content?: object[];

  @ApiProperty({ description: 'limit user can see of this post' })
  @IsString()
  limit?: Limit;

  @ApiProperty({
    description: 'limit user can see this post of this lesson',
    type: [StoredFile],
  })
  @ValidateNested()
  @IsOptional()
  file?: Array<StoredFile>;
}
export class UpdatePostOutput extends CoreOutput {}

export class ListPublicPostOutput extends CoreOutput {
  @ApiProperty({ description: 'list post output', isArray: true, type: [Post] })
  @ValidateNested({ each: true })
  @Type(() => Post)
  posts?: Post[];
}
//xem đanh sách bài đăng công khai của một cá nhân
export class ListPublicUserPostInput {
  @ApiProperty({ description: 'user id  of post to show' })
  userId: number;
}
export class ListPublicUserPostOutput extends CoreOutput {
  @ApiProperty({ description: 'list post output', isArray: true, type: [Post] })
  @ValidateNested({ each: true })
  @Type(() => Post)
  posts?: Post[];
}
