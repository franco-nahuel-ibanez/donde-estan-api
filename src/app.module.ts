import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'ormconfig';
import { ConfigurationModule } from './configuration/configuration.module';
import { MobileVersionsModule } from './mobile-versions/mobile-versions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ConfigurationModule,
    MobileVersionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
