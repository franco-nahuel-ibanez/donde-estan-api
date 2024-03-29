import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserStatus } from './entities/user-status.entity';
import { UserType } from './entities/user-type.entity';
import { AuthModule } from '../auth/auth.module';
import { ReportedPersonModule } from '../reported-person/reported-person.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, UserType, UserStatus]),
    AuthModule,
    forwardRef(() => ReportedPersonModule),
  ],
  exports: [UserService, TypeOrmModule.forFeature([User, UserType, UserStatus])],
})
export class UserModule {}
