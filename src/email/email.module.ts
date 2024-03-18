import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        return {
          transport: {
            host: process.env.MAIL_HOST,
            secure: process.env.MAIL_SECURE === 'true',
            ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
						requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
            port: parseInt(process.env.MAIL_PORT),
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
            tls: { rejectUnauthorized: false, },
          },
          defaults: {
            from: `"APP - ¿Donde Estan?" <${process.env.MAIL_FROM}>`,
          },
          template: {
            dir: path.join(__dirname, '../../email/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
})
export class EmailModule {}
