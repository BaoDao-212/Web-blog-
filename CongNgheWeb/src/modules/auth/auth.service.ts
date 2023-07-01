import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';

import { User } from 'src/entities/user.entity';
import { Repository, Not } from 'typeorm';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
  ListUserOutput,
  LoginInput,
  LoginOutput,
  NewAccessTokenInput,
  NewAccessTokenOutput,
  RegisterUserInput,
  RegisterUserOutput,
} from './dto/auth.dto';
import { createError } from '../common/utils/createError';
import {
  ACCESS_TOKEN_EXPIRED_IN,
  ACCESS_TOKEN_SECRET,
} from '../common/constants/constants';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // TODO: thêm kiểm tra opt gửi về điện thoại
  async registerUser({
    password,
    email,
    name,
    username,
    confirmPassword,
  }: RegisterUserInput): Promise<RegisterUserOutput> {
    try {
      if (password !== confirmPassword)
        return createError('Input', 'Mật khẩu lặp lại không khớp');
      const user = await this.userRepo.findOne({
        where: {
          username,
        },
      });
      if (user) return createError('Input', 'Tài khoản đã được đăng kí');

      const userH = this.userRepo.create({
        password,
        email,
        name,
        username,
      });

      await this.userRepo.save(userH);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async login({ password, username }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          username,
        },
        select: ['id', 'password'],
      });

      if (!user)
        return createError('Input', 'Người dùng không tồn tại trên hệ thống');
      if (!(await user.checkPassword(password)))
        return createError('Input', 'Mật khẩu không đúng');

      const accessToken = sign(
        {
          userId: user.id,
        },
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
        {
          expiresIn: this.configService.get<string>(ACCESS_TOKEN_EXPIRED_IN),
        },
      );

      return {
        ok: true,
        accessToken,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async newAccessToken({
    accessToken,
  }: NewAccessTokenInput): Promise<NewAccessTokenOutput> {
    try {
      const decoded = verify(
        accessToken,
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
      );
      if (!decoded || !decoded['userId']) throw new JsonWebTokenError('');
      const newAccessToken = sign(
        {
          userId: decoded['userId'],
        },
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
        {
          expiresIn: this.configService.get<string>(ACCESS_TOKEN_EXPIRED_IN),
        },
      );
      return {
        ok: true,
        accessToken: newAccessToken,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async changePassword(
    currentUser: User,
    input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    try {
      const { confirmNewPassword, newPassword, oldPassword } = input;
      const user = await this.userRepo.findOne({
        where: { id: currentUser.id },
        select: ['password', 'id'],
      });

      //kiem tra User ton tai khong
      if (!user) createError('Input', 'Người dùng không tồn tại');

      //kiem tra mat khau hien tai dung hay khong
      if (!(await user.checkPassword(oldPassword)))
        return createError('Input', 'Mật khẩu hiện tại không đúng');

      //Kiem tra mat khau moi va mat khau nhap lai co trung nhau hay khong
      if (newPassword !== confirmNewPassword)
        return createError('Input', 'Mật khẩu lặp lại không khớp');

      //kiem tra mat khau cu va mat khau moi co trung nhau khong
      if (await user.checkPassword(newPassword))
        return createError(
          'Input',
          'Mật khẩu mới không được trùng mật khẩu cũ',
        );

      user.password = newPassword;
      await this.userRepo.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async listUser(currentUser: User): Promise<ListUserOutput> {
    try {
      const users = await this.userRepo.find({
        where: {
          id: Not(currentUser.id),
        },
      });
      return {
        ok: true,
        users,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //login by google
  // async validateUser(details: UserDetails) {
  //   console.log('AuthService');
  //   console.log(details);
  //   const user = await this.userRepo.findOneBy({ email: details.email });
  //   console.log(user);
  //   if (user) return user;
  //   console.log('User not found. Creating...');
  //   const newUser = this.userRepo.create(details);
  //   return this.userRepo.save(newUser);
  // }

  async findUser(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    return user;
  }
  googleLogin(req) {
    if (!req.user) {
      return 'No user from Google';
    }

    const payload = {
      email: req.user.email,
      sub: req.user.userId,
    };

    const jwt = this.jwtService.sign(payload);
    console.log(req.user);

    return {
      message: 'User information from Google',
      user: req.user,
      jwt,
    };
  }
}
