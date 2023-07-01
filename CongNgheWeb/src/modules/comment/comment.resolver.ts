import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import { CommentService } from './comment.service';
import {
  CreateCommentInput,
  CreateCommentOutput,
  DeleteCommentInput,
  DeleteCommentOutput,
  ListCommentPostInput,
  ListCommentPostOutput,
  UpdateCommentInput,
  UpdateCommentOutput,
} from './comment.dto';
import { Roles } from '../auth/role.decorator';

@ApiTags('Comment')
@Controller('/comment')
@ApiSecurity('admin')
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}
  @ApiOperation({
    summary: 'Create Comment',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateCommentOutput })
  async createComment(
    @CurrentUser() user: User,
    @Body() input: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    return this.commentService.createComment(user, input);
  }

  @ApiOperation({
    summary: 'Delete Comment',
  })
  @Roles(['Any'])
  @Delete('delete')
  @ApiOkResponse({ type: UpdateCommentOutput })
  async deleteComment(
    @CurrentUser() user: User,
    @Body() input: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    return this.commentService.deleteComment(user, input);
  }
  @ApiOperation({
    summary: 'Update Comment',
  })
  @Roles(['Any'])
  @Put('update')
  @ApiOkResponse({ type: UpdateCommentOutput })
  async updateComment(
    @CurrentUser() user: User,
    @Body() input: UpdateCommentInput,
  ): Promise<UpdateCommentOutput> {
    return this.commentService.updateComment(user, input);
  }
  @ApiOperation({
    summary: 'List Comment of 1 post',
  })
  @Roles(['Any'])
  @Post('/list')
  @ApiOkResponse({ type: ListCommentPostOutput })
  async listCommentPost(
    @CurrentUser() user: User,
    @Body() input: ListCommentPostInput,
  ): Promise<ListCommentPostOutput> {
    return this.commentService.listCommentUser(user, input);
  }
}
