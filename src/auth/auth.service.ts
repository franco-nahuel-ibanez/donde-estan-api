import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import ShortUniqueId from 'short-unique-id';
import { hash, compare, genSalt } from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventEnum } from 'src/enums/event.enum';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { StatusEnum } from 'src/enums/status.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly uuid = new ShortUniqueId({
    dictionary: 'number',
    length: 6,
  });
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
       
    private readonly eventEmitter: EventEmitter2,

    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const { name, lastName, email, phoneNumber, password } = registerUserDto;
      const user = await this.userRepository.findOneBy({ email });
      
      if (user && user.userStatusId === 1) {
        throw new BadRequestException({
          title: 'Usuario ya registrado',
          message: 'El usuario ya se encuentra registrado, por favor inicie sesión o recupere su contraseña',
        });
      }
  
      if (user && user.userStatusId === 2) {
        throw new BadRequestException({
          title: 'Usuario pendiente de verificación',
          message: 'El usuario ya se encuentra registrado, pero no ha verificado su correo electrónico, por favor verifique su correo electrónico. Puede solicitar un nuevo código de verificación en caso de no haberlo recibido.',
        });
      }
  
      if (user && user.userStatusId === 4) {
        throw new BadRequestException({
          title: 'Usuario Bloqueado',
          message: 'El usuario ya se encuentra registrado, pero se encuentra bloqueado, por favor comuníquese con el administrador.',
        });
      }
  
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
  
      const newUser = this.userRepository.create({
        name,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        accountEnableCode: this.uuid.randomUUID(),
        userTypeId: 2,
        userStatusId: 2,
      });
  
      await this.userRepository.save(newUser);
      this.eventEmitter.emit(EventEnum.SEND_CODE_CONFIRMATION, {
        email: newUser.email,
        code: newUser.accountEnableCode,
      });

      // generate token
      const payload: JwtPayload = {
        id: newUser.id,
        email: newUser.email,
        userTypeId: newUser.userTypeId,
        userStatusId: newUser.userStatusId,
      };

      const token = this.getJwtToken(payload);
      
      return {
        title: 'Usuario registrado',
        message: 'El usuario ha sido registrado, por favor verifique su correo electrónico para activar su cuenta',
        data: {
          token,
        },
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        title: 'Error al registrar usuario',
        message: 'Ocurrió un error al registrar el usuario, por favor intente nuevamente',
      });
    }
  }

  async verifyAccount(email: string, code: string) {
    try {
      const user = await this.userRepository.findOneBy({ email, accountEnableCode: code });

      if (!user) {
        throw new BadRequestException({
          title: 'Código de verificación inválido',
          message: 'El código de verificación es inválido, por favor verifique que el correo electrónico y el código sean correctos',
        });
      }
  
      if (user.userStatusId === 1) {
        throw new BadRequestException({
          title: 'Cuenta ya verificada',
          message: 'La cuenta ya ha sido verificada, por favor inicie sesión',
        });
      }
  
      user.userStatusId = StatusEnum.REGISTER_WITHOUT_ACCEPTING_TERMS_AND_CONDITIONS;
      await this.userRepository.save(user);
  
      // [TODO] Send email to user
  
      // [TODO] Send email to admin
  
      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        userTypeId: user.userTypeId,
        userStatusId: user.userStatusId,
      };
  
      const token = this.getJwtToken(payload);
  
      return {
        title: 'Cuenta verificada',
        message: 'La cuenta ha sido verificada, por favor inicie sesión',
        data: {
          token,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        title: 'Error al verificar cuenta',
        message: 'Ocurrió un error al verificar la cuenta, por favor intente nuevamente',
      });
    }
  }

  async acceptTermsAndConditions(email: string, accept: boolean) {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new BadRequestException({
          title: 'Usuario no encontrado',
          message: 'El usuario no se encuentra registrado, por favor verifique el correo electrónico',
        });
      }

      if (user.userStatusId === 4) {
        throw new BadRequestException({
          title: 'Usuario Bloqueado',
          message: 'El usuario ya se encuentra registrado, pero se encuentra bloqueado, por favor comuníquese con el administrador.',
        });
      }

      if (user.userStatusId === 1) {
        throw new BadRequestException({
          title: 'Cuenta ya verificada',
          message: 'La cuenta ya ha sido verificada, por favor inicie sesión',
        });
      }


      if (!accept) {
        throw new BadRequestException({
          title: 'Términos y condiciones no aceptados',
          message: 'Los términos y condiciones no han sido aceptados, por favor acepte los términos y condiciones para continuar',
        });
      }

      user.userStatusId = StatusEnum.ENABLED;
      await this.userRepository.save(user);

      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        userTypeId: user.userTypeId,
        userStatusId: user.userStatusId,
      };

      const token = this.getJwtToken(payload);

      return {
        title: 'Términos y condiciones aceptados',
        message: 'Los términos y condiciones han sido aceptados, por favor inicie sesión',
        data: {
          token,
        },
      };

    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        title: 'Error al aceptar términos y condiciones',
        message: 'Ocurrió un error al aceptar los términos y condiciones, por favor intente nuevamente',
      });
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new BadRequestException({
          title: 'Usuario no encontrado',
          message: 'El usuario no se encuentra registrado, por favor verifique el correo electrónico y la contraseña',
        });
      }
    
      if (user.userStatusId === 4) {
        throw new BadRequestException({
          title: 'Usuario Bloqueado',
          message: 'El usuario ya se encuentra registrado, pero se encuentra bloqueado, por favor comuníquese con el administrador.',
        });
      }
  
      const isMatch = await compare(password, user.password);
  
      if (!isMatch) {
        throw new BadRequestException({
          title: 'Contraseña incorrecta',
          message: 'La contraseña es incorrecta, por favor verifique el correo electrónico y la contraseña',
        });
      }
  
      // [TODO] Send token to user
      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        userTypeId: user.userTypeId,
        userStatusId: user.userStatusId,
      };

      const token = this.getJwtToken(payload);
  
      return {
        title: 'Usuario autenticado',
        message: 'El usuario ha sido autenticado',
        data: {
          token,
        }
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        title: 'Error al autenticar usuario',
        message: 'Ocurrió un error al autenticar el usuario, por favor intente nuevamente',
      });
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new BadRequestException({
          title: 'Usuario no encontrado',
          message: 'El usuario no se encuentra registrado, por favor verifique el correo electrónico',
        });
      }
    
      if (user.userStatusId === 4) {
        throw new BadRequestException({
          title: 'Usuario Bloqueado',
          message: 'El usuario ya se encuentra registrado, pero se encuentra bloqueado, por favor comuníquese con el administrador.',
        });
      }
  
      user.resetPasswordCode = this.uuid.randomUUID();
      await this.userRepository.save(user);
  
      const event = this.eventEmitter.emit(EventEnum.SEND_RESET_PASSWORD_CODE, {
        email: user.email,
        code: user.resetPasswordCode,
      });
  
      if (!event) {
        throw new BadRequestException({
          title: 'Error al enviar código de recuperación',
          message: 'Ocurrió un error al enviar el código de recuperación, por favor intente nuevamente',
        });
      }
  
      return {
        title: 'Código de recuperación enviado',
        message: 'Se ha enviado un código de recuperación a su correo electrónico',
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        title: 'Error al enviar código de recuperación',
        message: 'Ocurrió un error al enviar el código de recuperación, por favor intente nuevamente',
      });
    }
  }



  async resetPassword(email: string, password: string, code: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new BadRequestException({
          title: 'Usuario no encontrado',
          message: 'El usuario no se encuentra registrado, por favor verifique el correo electrónico',
        });
      }

      if (user.userStatusId === 4) {
        throw new BadRequestException({
          title: 'Usuario Bloqueado',
          message: 'El usuario ya se encuentra registrado, pero se encuentra bloqueado, por favor comuníquese con el administrador.',
        });
      }

      if (user.resetPasswordCode !== code) {
        throw new BadRequestException({
          title: 'Código de recuperación inválido',
          message: 'El código de recuperación es inválido, por favor verifique el correo electrónico y el código',
        });
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      user.password = hashedPassword;
      user.resetPasswordCode = null;
      await this.userRepository.save(user);

      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        userTypeId: user.userTypeId,
        userStatusId: user.userStatusId,
      };

      const token = this.getJwtToken(payload);

      return {
        title: 'Contraseña actualizada',
        message: 'La contraseña ha sido actualizada',
        data: {
          token,
        }
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({
        title: 'Error al actualizar contraseña',
        message: 'Ocurrió un error al actualizar la contraseña, por favor intente nuevamente',
      });
    }
  }




  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
