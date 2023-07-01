import { State } from '@/src/utils/enum/enum';

declare namespace API {
    type DeletePostInput = {
        postId: number;
    };
    type UpdatePostInput = {
        postId: number;
        userTagsId: string;
        content: string;
        limit: string;
        file: string;
    };
    type CreatePostInput = {
        userTagsId: string;
        content: string;
        limit: State;
        file?: File[];
    };
    type ListPostOutput = {
        posts: Post[];
    };
    type ListUserPostInput = {
        userId: number;
    };
    type File = {
        fileUrl: string;
        filePath: string;
    };
    type UserPost = {
        userId: number;
    };
    type Post = {
        owner: User;
        userTags: User[];
        content: string;
        limit: State;
        file?: File[];
        comment: any;
    };
    type User = {
        name?: string;
        username?: string;
        avartar?: File;
    };
}
