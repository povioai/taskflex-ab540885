import { Global, Module } from '@nestjs/common';

import { getConfigFactory } from '~common/config';

import { PrismaConfig } from './prisma.config';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, getConfigFactory(PrismaConfig)],
  exports: [PrismaService],
})
export class PrismaModule {}
