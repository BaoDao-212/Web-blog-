import { defineStore } from 'pinia';
import { store } from '.';
import { createPost, listPublicPost } from '../api/post';
import { createComment } from '../api/comment';

interface PostState {
    posts: [];
}
export const usePostStore = defineStore({
    id: 'Post',
    state: (): PostState => ({
        posts: []
    }),

    actions: {
        async createPost(params: any) {
            try {
                const data = await createPost(params);
                console.log(data);
                return data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async createComment(params: any) {
            try {
                const data = await createComment(params);
                return data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async listPublicPost() {
            try {
                const data = await listPublicPost();
                this.posts = data.posts;
                return data;
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
});

export function usePostStoreWithOut() {
    return usePostStore(store);
}
