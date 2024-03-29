import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'ormconfig';
import { ConfigurationModule } from './configuration/configuration.module';
import { MobileVersionsModule } from './mobile-versions/mobile-versions.module';
import { UserModule } from './user/user.module';
import { ReportedPersonModule } from './reported-person/reported-person.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { EmailModule } from './email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ConfigurationModule,
    MobileVersionsModule,
    UserModule,
    ReportedPersonModule,
    AuthModule,
    EventModule,
    EventEmitterModule.forRoot(),
    EmailModule,
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
