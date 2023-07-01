import { BaseResponse, request } from '@/utils/request';

export function createComment(data: any) {
    return request({
        url: 'comment/create',
        method: 'post',
        data
    });
}
export function deleteComment(data: API.DeleteCommentInput) {
    return request({
        url: 'comment/delete',
        method: 'delete',
        data
    });
}
export function listComment(data: API.ListCommentInput) {
    return request<BaseResponse<API.ListCommentOutput>>({
        url: 'comment/list',
        method: 'post',
        data
    });
}
