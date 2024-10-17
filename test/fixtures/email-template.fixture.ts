import { INestApplication } from '@nestjs/common';
import { EmailTemplate } from '@prisma/client';

import { PrismaService } from '~database/prisma';

export class EmailTemplateFixture {
  static async createTemplate(app: INestApplication, name: string, description?: string): Promise<EmailTemplate> {
    const prisma = app.get<PrismaService>(PrismaService);

    const emailTemplate = await prisma.client.emailTemplate.create({ data: { name, description } });

    return emailTemplate;
  }
}
