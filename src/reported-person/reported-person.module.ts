import { Module } from '@nestjs/common';
import { ReportedPersonService } from './reported-person.service';
import { ReportedPersonController } from './reported-person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportedPerson } from './entities/reported-person.entity';
import { personStatus } from './entities/person-status.entity';
import { ReportingStatus } from './entities/reporting-status.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [ReportedPersonController],
  providers: [ReportedPersonService],
  imports: [
    TypeOrmModule.forFeature([ReportedPerson, personStatus, ReportingStatus, User]),
    AuthModule,
    MulterModule.register({
      dest: './files',
    }),
  ],
  exports: [
    ReportedPersonService,
    TypeOrmModule.forFeature([ReportedPerson, personStatus, ReportingStatus, User]),
    ReportedPersonModule
  ],
})
export class ReportedPersonModule {}
