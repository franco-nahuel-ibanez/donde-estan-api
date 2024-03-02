import { Module } from '@nestjs/common';
import { MobileVersionsService } from './mobile-versions.service';
import { MobileVersionsController } from './mobile-versions.controller';

@Module({
  controllers: [MobileVersionsController],
  providers: [MobileVersionsService],
})
export class MobileVersionsModule {}
