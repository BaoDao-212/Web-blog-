import { BaseResponse, request } from '@/utils/request';

export function createPost(data: any) {
    return request({
        url: 'post/create',
        method: 'post',
        data
    });
}
export function updatePost(data: any) {
    return request({
        url: 'post/update',
        method: 'put',
        data
    });
}
export function tymPost(data: any) {
    return request({
        url: 'post/tym',
        method: 'put',
        data
    });
}

export function listPublicPost() {
    return request<API.ListPostOutput>({
        url: 'post/list',
        method: 'get'
    });
}
export function listPostOfUser() {
    return request<API.ListPostOutput>({
        url: 'post/owner/list',
        method: 'get'
    });
}
export function listpublicUserPost(data: API.UserPost) {
    return request<API.ListPostOutput>({
        url: 'post/userlist',
        method: 'post',
        data
    });
}
