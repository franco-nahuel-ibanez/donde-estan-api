import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserStatus } from './entities/user-status.entity';
import { UserType } from './entities/user-type.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, UserType, UserStatus]),
    AuthModule,
  ],
  exports: [UserService, TypeOrmModule.forFeature([User, UserType, UserStatus])],
})
export class UserModule {}
