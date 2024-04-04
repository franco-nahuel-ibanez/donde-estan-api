import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportedPerson } from '../reported-person/entities/reported-person.entity'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(ReportedPerson)
    private reportedPersonRepository: Repository<ReportedPerson>
  ) {}

  getUser(user: User) {
    this.logger.verbose(`Obteniendo usuario ${user.id}`);
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      userStatus: user.userStatusId,
      userType: user.userTypeId
    }
  }
  
  async update(user: User, updateUserDto: UpdateUserDto) {
    this.logger.verbose(`Actualizando usuario ${user.id}`);
    try {
      const { name, lastName, email } = updateUserDto;
      user.name = name;
      user.lastName = lastName;
      user.email = email;
      user.phoneNumber = updateUserDto.phoneNumber;
      
      await this.userRepository.save(user);
      this.logger.verbose(`Usuario ${user.id} actualizado correctamente`);
      return {
        id: user.id,
        name: user.name,
        lastname: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userStatus: user.userStatusId,
        userType: user.userTypeId
      }
    } catch (error) {
      throw new BadRequestException({
        title: 'Error',
        message: 'Error al actualizar la cuenta',
      })
    }
  }

  async deleteAccount(user: User) {
    try {

      await this.reportedPersonRepository.createQueryBuilder()
        .delete()
        .from(ReportedPerson)
        .where('reportedById = :id', { id: user.id })
        .execute();

      // delete user
      await this.userRepository.delete(user.id);
      return {
        message: 'User deleted successfully'
      }
    } catch (error) {
      throw new BadRequestException({
        title: 'Error',
        message: 'Error al eliminar la cuenta',
      })
    }
  }

  async block(user: User, userId: number) {
    try {
      if (user.userTypeId !== 1) {
        throw new BadRequestException({
          title: 'Error',
          message: 'No tienes permisos para bloquear usuarios',
        })
      }

      const userToBlock = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!userToBlock) {
        throw new BadRequestException({
          title: 'Error',
          message: 'Usuario no encontrado',
        })
      }

      userToBlock.userStatusId = 4;
      await this.userRepository.save(userToBlock);
      return {
        title: 'Usuario bloqueado',
        message: 'Usuario bloqueado correctamente'
      }
    } catch (error) {
      throw new BadRequestException({
        title: 'Error',
        message: 'Error al bloquear el usuario',
      })
    }
  }



}
