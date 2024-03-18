import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { EventEnum } from '../enums/event.enum';

@Module({
  imports: [ ConfigModule]
})
export class EventModule {
  private readonly logger = new Logger(EventModule.name);

  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent(EventEnum.SEND_CODE_CONFIRMATION)
  sendVerificationCode({ email, code }) {
    this.logger.verbose(`Evento recibido: ${EventEnum.SEND_CODE_CONFIRMATION}`);
    this.mailService.sendMail({
      to: email,
      subject: 'BIENVENIDO A DONDE ESTAN?',
      template: 'code-verification',
      context: {
        code,
      },
    }).then(() => {
      this.logger.verbose('email enviado');
    }).catch((error) => {
      this.logger.error('error', JSON.stringify(error));
    });
  }

  @OnEvent(EventEnum.SEND_RESET_PASSWORD_CODE)
  forgotPassword({ email, code }) {
    this.logger.verbose(`Evento recibido: ${EventEnum.SEND_RESET_PASSWORD_CODE}`);
    this.mailService.sendMail({
      to: email,
      subject: 'Código de recuperación',
      template: 'forgot-password',
      context: {
        code,
      },
    }).then(() => {
      this.logger.verbose('email enviado');
    }).catch((error) => {
      this.logger.error('error', JSON.stringify(error));
    });
  }


}
