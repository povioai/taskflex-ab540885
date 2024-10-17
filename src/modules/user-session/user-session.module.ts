import { Module } from '@nestjs/common';

import { UserSessionController } from './user-session.controller';
import { UserSessionRepository } from './user-session.repository';
import { UserSessionService } from './user-session.service';

@Module({
  controllers: [UserSessionController],
  providers: [UserSessionRepository, UserSessionService],
  exports: [UserSessionService],
})
export class UserSessionModule {}
