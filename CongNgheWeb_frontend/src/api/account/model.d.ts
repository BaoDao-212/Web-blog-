declare namespace API {
    type UserInfo = {
        id: number;
        name: string;
        username: string;
        password: string;
        email: string;
        phone: string;
        avartar?: Avartar;
    };
    type ListUserOutput = {
        users: User[];
    };
    type User = {
        name?: string;
        username?: string;
        avartar?: Avartar;
    };
    type Avartar = {
        fileUrl: string;
        filePath: string;
    };
    type RegisterParams = {
        name: string;
        confirmPassword: string;
        email: string;
        password: string;
        username: string;
    };
    type ChangePasswordParams = {
        oldPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    };
}
