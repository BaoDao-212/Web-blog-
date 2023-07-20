import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Between, In } from 'typeorm';
import { createError } from '../common/utils/createError';
import { User } from 'src/entities/user.entity';
import { Limit, Post } from 'src/entities/post.entity';
import {
  CreatePostInput,
  CreatePostOutput,
  DeletePostInput,
  DeletePostOutput,
  ListPublicPostOutput,
  ListPublicUserPostInput,
  ListPublicUserPostOutput,
  TymPostInput,
  UpdatePostInput,
  UpdatePostOutput,
} from './post.dto';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createPost(
    owner: User,
    input: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      const { content, limit, userTagsId, file } = input;
      userTagsId.forEach(async (userID) => {
        const user = await this.userRepo.findOne({
          where: {
            id: userID,
          },
        });
        if (!user)
          return createError(
            'Input',
            'Không tồn tại một trong số những người gắn thẻ này',
          );
      });
      console.log(file);

      const userT = await this.userRepo.find({
        where: {
          id: In(userTagsId),
        },
        relations: {
          comments: true,
          posts: true,
        },
      });
      await this.postRepo.save(
        this.postRepo.create({
          content,
          limit,
          userTags: userT,
          file,
          owner,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async deletePost(
    owner: User,
    input: DeletePostInput,
  ): Promise<DeletePostOutput> {
    try {
      const { postId } = input;
      const post = await this.postRepo.findOne({
        where: { id: postId },
        relations: {
          comments: true,
          owner: true,
        },
      });
      console.log(post);

      console.log(post?.owner?.id);
      console.log(owner?.id);

      if (post?.owner?.id != owner?.id)
        return createError('Input', 'Yêu cầu không hợp lệ');
      const comments = await this.commentRepo.find({
        where: { post: { id: postId } },
        relations: {
          post: true,
        },
      });
      await this.commentRepo.remove(comments);
      if (!post) return createError('Input', 'Bài viết này không còn tồn tại');
      await this.postRepo.remove(post);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //thay đổi bài đăng
  async updatePost(
    owner: User,
    input: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    try {
      const { postId, content, limit, file, userTagsId } = input;
      const post = await this.postRepo.findOne({
        where: { id: postId },
        relations: {
          comments: true,
          owner: true,
          userTags: true,
        },
      });
      if (post.owner.id !== owner.id)
        return createError(
          'Input',
          'Bạn không có quyền cập nhật bài đăng của người khác',
        );
      userTagsId.forEach(async (userID) => {
        const user = await this.userRepo.findOne({
          where: {
            id: userID,
          },
        });
        if (!user)
          return createError(
            'Input',
            'Không tồn tại một trong số những người gắn thẻ này',
          );
      });
      const userT = await this.userRepo.find({
        where: {
          id: In(userTagsId),
        },
        relations: {
          comments: true,
          posts: true,
        },
      });
      if (!post) return createError('Input', 'Bài đăng này không còn tồn tại');
      post.content = content;
      post.file = file;
      post.userTags = userT;
      post.limit = limit;
      await this.postRepo.save(post);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async tymPost(owner: User, input: TymPostInput): Promise<UpdatePostOutput> {
    try {
      const { postId } = input;
      const post = await this.postRepo.find({
        where: { id: In(postId) },
        relations: {
          userTym: true,
        },
      });
      post.forEach(async (p) => {
        const tymBoolean = p.userTym.map((user) => user.id).includes(owner.id);
        if (!tymBoolean) p.userTym.push(owner);
        else p.userTym = p.userTym.filter((u) => u.id != owner.id);
        await this.postRepo.save(p);
      });
      // await this.postRepo.save(post);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //danh sach bai dang cong khai
  async listPublicPost(): Promise<ListPublicPostOutput> {
    try {
      // Calculate date 10 days ago
      const now = new Date();
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      const posts = await this.postRepo.find({
        where: {
          limit: Limit.Public,
          createdAt: Between(tenDaysAgo, now), // Use Between operator to filter posts created within the last 10 days
        },
        relations: {
          owner: true,
          userTags: true,
          comments: {
            owner: true,
          },
          userTym: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      // posts.forEach(async (post) => {
      //   if (post.comments.length > 0) {
      //     console.log(post);
      //     const commentId = post.comments.map((c) => c.id);
      //     const comment = await this.commentRepo.find({
      //       where: {
      //         id: In(commentId),
      //       },
      //       relations: {
      //         userTags: true,
      //         owner: true,
      //       },
      //     });
      //     post.comments = comment;
      //   }
      // });
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // xem danh sách bài viết công khai của người khác
  async listPublicUserPost(
    owner: User,
    input: ListPublicUserPostInput,
  ): Promise<ListPublicUserPostOutput> {
    try {
      const user = this.userRepo.findOne({
        where: {
          id: input.userId,
        },
      });
      if (!user)
        return createError(
          'Input',
          'Người dùng này không còn tồn tại trong hệ thống nữa',
        );
      const posts = await this.postRepo.find({
        where: {
          limit: Limit.Public,
          owner: { id: input.userId },
        },
        relations: {
          owner: true,
          userTags: true,
          comments: {
            owner: true,
          },
          userTym: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //xem tất cả bài viết của bản thân
  async listPostOfUser(owner: User): Promise<ListPublicUserPostOutput> {
    try {
      const posts = await this.postRepo.find({
        where: {
          owner: { id: owner.id },
        },
        relations: {
          owner: true,
          userTags: true,
          comments: {
            owner: true,
          },
          userTym: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
