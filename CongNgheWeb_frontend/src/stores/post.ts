import { defineStore } from 'pinia';
import { store } from '.';
import { createPost, listPublicPost } from '../api/post';
import { createComment } from '../api/comment';

interface PostState {
    posts: [];
    tymPostId: number[];
    removeTymPostId: number[];
}
export const usePostStore = defineStore({
    id: 'Post',
    state: (): PostState => ({
        posts: [],
        tymPostId: [],
        removeTymPostId: []
    }),
    getters: {
        getTymPostId(): number[] {
            return this.tymPostId;
        },
        getRemoveTymPostId(): number[] {
            return this.removeTymPostId;
        }
    },
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
        async createTymPostId(postId: any) {
            try {
                if (!this.tymPostId.includes(postId)) this.tymPostId.push(postId);
                return this.tymPostId;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async removeTymPostId(postId: any) {
            try {
                if (this.tymPostId.includes(postId)) this.tymPostId = this.tymPostId.filter((id) => postId != id);
                return this.tymPostId;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async resetTym() {
            try {
                this.tymPostId = [];
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
