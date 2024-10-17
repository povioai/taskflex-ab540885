import { Injectable } from '@nestjs/common';

import { PrismaService } from '~database/prisma';

import { EmailTemplateHelper } from './email-template.helper';
import { IEmailTemplateCreate } from './interfaces/email-template.create.interface';
import { IEmailTemplate } from './interfaces/email-template.interface';
import { IEmailTemplateList } from './interfaces/email-template.list.interface';
import { IEmailTemplateUpdate } from './interfaces/email-template.update.interface';

@Injectable()
export class EmailTemplateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(options?: IEmailTemplateList): Promise<IEmailTemplate[]> {
    const emailTemplates = await this.prismaService.client.emailTemplate.findMany({
      where: {
        id: options?.ids ? { in: options.ids } : undefined,
      },
      include: {
        emailTemplateVersions: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return emailTemplates.map((emailTemplate) => EmailTemplateHelper.fromEmailTemplate(emailTemplate));
  }

  async findById(id: string): Promise<IEmailTemplate | undefined> {
    const emailTemplate = await this.prismaService.client.emailTemplate.findUnique({
      where: {
        id,
      },
      include: {
        emailTemplateVersions: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    if (!emailTemplate) {
      return undefined;
    }

    return EmailTemplateHelper.fromEmailTemplate(emailTemplate);
  }

  async create(body: IEmailTemplateCreate): Promise<IEmailTemplate> {
    const emailTemplate = await this.prismaService.client.emailTemplate.create({
      data: {
        name: body.name,
        description: body.description,
      },
      include: {
        emailTemplateVersions: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    return EmailTemplateHelper.fromEmailTemplate(emailTemplate);
  }

  async update(id: string, body: IEmailTemplateUpdate): Promise<IEmailTemplate> {
    const emailTemplate = await this.prismaService.client.emailTemplate.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
      include: {
        emailTemplateVersions: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    return EmailTemplateHelper.fromEmailTemplate(emailTemplate);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.client.emailTemplate.delete({
      where: {
        id,
      },
    });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prismaService.client.emailTemplate.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
