import { Module } from '@nestjs/common';
import { ReportedPersonService } from './reported-person.service';
import { ReportedPersonController } from './reported-person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportedPerson } from './entities/reported-person.entity';
import { personStatus } from './entities/person-status.entity';
import { ReportingStatus } from './entities/reporting-status.entity';
import { User } from '../user/entities/user.entity';

@Module({
  controllers: [ReportedPersonController],
  providers: [ReportedPersonService],
  imports: [
    TypeOrmModule.forFeature([ReportedPerson, personStatus, ReportingStatus, User]),
  ],
  exports: [ReportedPersonService],
})
export class ReportedPersonModule {}
