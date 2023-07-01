import { defineStore } from 'pinia';
import { ACCESS_TOKEN_KEY } from '../utils/enum/enum';
import Storage from '../utils/Storage';
import { login } from '../api/login';
import { getInfo, listUser, register, updatePassword } from '@/api/account';
import { store } from '.';
import { listComment } from '../api/comment';

interface UserState {
    token: string;
    userInfo: Partial<API.UserInfo>;
    listUser: Partial<API.User>[];
}
export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        token: Storage.get(ACCESS_TOKEN_KEY, null),
        userInfo: {},
        listUser: []
    }),
    getters: {
        getToken(): string {
            return this.token;
        },
        getListUser(): API.User[] {
            return this.listUser;
        },
        getUserInfo(): any {
            return this.userInfo;
        }
    },
    actions: {
        resetToken() {
            this.token = '';
            this.userInfo = {};
            Storage.clear();
            console.log(Storage.get(ACCESS_TOKEN_KEY, null));
        },
        setToken(token: string) {
            this.token = token ?? '';
            const ex = 7 * 24 * 60 * 60 * 1000;
            Storage.set(ACCESS_TOKEN_KEY, this.token, ex);
        },
        async login(params: API.LoginParams) {
            try {
                const { data } = await login(params);
                this.setToken(data.accessToken);
                return this.afterLogin();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async listUser() {
            try {
                const data = await listUser();
                this.listUser = data.users;
                return data.users;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async afterLogin() {
            try {
                const { data } = await getInfo();
                console.log(data);
                this.userInfo = data;
                return data;
                // console.log(this.userInfo);
                // return user;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async logout() {
            // await logout();
            this.resetToken();
        },
        async register(params: API.RegisterParams) {
            const r = await register(params);
            return r;
        },
        async changePassword(params: API.ChangePasswordParams) {
            const r = await updatePassword(params);
            console.log(r);
            return r;
        }
    }
});

export function useUserStoreWithOut() {
    return useUserStore(store);
}
