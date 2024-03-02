import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

const configService = new ConfigService();

const options: DataSourceOptions = {
  namingStrategy: new SnakeNamingStrategy(),
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  database: configService.get('DB_NAME'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  entities: [path.join(__dirname, '/src/**/*.entity{.ts,.js}')],
  migrations: ['dist/src/migrations/**/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  synchronize: false,
  logging: false,
};

export const AppDataSource = new DataSource(options);
