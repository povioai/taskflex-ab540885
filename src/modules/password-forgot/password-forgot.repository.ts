import { Injectable } from '@nestjs/common';

import { PrismaService } from '~database/prisma';

import { IPasswordForgotCreate } from './interfaces/password-forgot.create.interface';
import { IPasswordForgot } from './interfaces/password-forgot.interface';
import { PasswordForgotHelper } from './password-forgot.helper';

@Injectable()
export class PasswordForgotRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: IPasswordForgotCreate): Promise<IPasswordForgot> {
    const passwordForgot = await this.prismaService.client.passwordForgot.create({
      data: {
        userId: data.userId,
        code: data.code,
        expireAt: data.expireAt,
      },
      include: {
        user: true,
      },
    });

    return PasswordForgotHelper.fromPasswordForgot(passwordForgot);
  }

  async findByCode(code: string): Promise<IPasswordForgot | undefined> {
    const passwordForgot = await this.prismaService.client.passwordForgot.findUnique({
      where: {
        code,
      },
      include: {
        user: true,
      },
    });

    if (!passwordForgot) {
      return undefined;
    }

    return PasswordForgotHelper.fromPasswordForgot(passwordForgot);
  }

  async deleteById(id: string): Promise<void> {
    await this.prismaService.client.passwordForgot.delete({
      where: {
        id,
      },
    });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.prismaService.client.passwordForgot.deleteMany({
      where: {
        userId,
      },
    });
  }
}
