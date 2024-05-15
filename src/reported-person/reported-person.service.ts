import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateReportedPersonDto } from './dto/create-reported-person.dto';
import { UpdateReportedPersonDto } from './dto/update-reported-person.dto';
import { ReportedPerson } from './entities/reported-person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { PersonStatus } from 'src/enums/personStatus.enum';
import { ReportingStatusEnum } from 'src/enums/reportingStatus.enum';
import { ReportFilterDto } from './dto/repot-filter.dto';
import { Pagination } from 'src/pagination/pagination.class';
import * as fs from 'fs';
import * as path from 'path';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ReportedPersonService {
  private readonly logger = new Logger(ReportedPersonService.name);

  constructor(
    @InjectRepository(ReportedPerson)
    private reportedPersonRepository: Repository<ReportedPerson>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private cloudinaryService: CloudinaryService,
  ) {}

  
  async create(createReportedPersonDto: CreateReportedPersonDto, user: User, image: Express.Multer.File) {
    try {
      this.logger.log('Creating a new reported person');
      if (user.userStatusId !== 1 || user.deletedAt !== null) {
        throw new BadRequestException({
          title: 'Usuario no permitido',
          message: 'El usuario no tiene permisos para realizar esta acción',
        });
      }

      const cloudinaryResponse = await this.cloudinaryService.uploadImage(image);

      const reportedPerson = this.reportedPersonRepository.create({
        ...createReportedPersonDto,
        image: cloudinaryResponse.secure_url,
        reportedBy: user,
        personStatusId: PersonStatus.SOUGHT,
        statusId: ReportingStatusEnum.PENDING,
      });
      await this.reportedPersonRepository.save(reportedPerson);
      
      return {
        title: 'Persona reportada',
        message: 'Persona reportada con éxito',
        data: reportedPerson,
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getPainaedReportedPersons(user:User, reportFilterDto: ReportFilterDto) {
    try {
      const {
        search,
        statusId,
        searchFields,
        orderByDate,
        page,
        size,
        dir,
        sort,
        orderByUpdate
      } = reportFilterDto;

      const query = this.reportedPersonRepository.createQueryBuilder('reportedPerson')
        .leftJoinAndSelect('reportedPerson.reportedBy', 'reportedBy')
        .where('reportedPerson.statusId = :statusId', { statusId: statusId || ReportingStatusEnum.APPROVED })
        
      if (search && searchFields) {
        let fields = ['name', 'lastName']

        query.andWhere(
          new Brackets((rp) => {
            fields.forEach((field: string) => {
              rp.orWhere(`reportedPerson.${field} LIKE :search`, { search: `%${search}%` });
            });
          }
        ));
      }

      return Pagination.getPaginatedResponse(
        {page, size, dir, sort},
        query,
        async (dataObj: ReportedPerson): Promise<any> => {
          return {
            ...dataObj,
            reportedBy: {
              id: dataObj.reportedBy.id,
              name: dataObj.reportedBy.name,
              lastName: dataObj.reportedBy.lastName,
              email: dataObj.reportedBy.email,
              phone: dataObj.reportedBy.phoneNumber,
            }
          }
        }
      )
    } catch (error) {
      console.log(error);
    }
  }

  async getMyReports(user: User, reportFilterDto: ReportFilterDto) {
    try {
      const {
        search,
        searchFields,
        orderByDate,
        page,
        size,
        dir,
        sort,
        orderByUpdate
      } = reportFilterDto;

      const query = this.reportedPersonRepository.createQueryBuilder('reportedPerson')
        .leftJoinAndSelect('reportedPerson.reportedBy', 'reportedBy')
        .where('reportedPerson.reportedById = :userId', { userId: user.id })

      if (search && searchFields) {
        let fields = ['name', 'lastName']

        query.andWhere(
          new Brackets((rp) => {
            fields.forEach((field: string) => {
              rp.orWhere(`reportedPerson.${field} LIKE :search`, { search: `%${search}%` });
            });
          }
        ));
      }

      return Pagination.getPaginatedResponse(
        {page, size, dir, sort},
        query,
        async (dataObj: ReportedPerson): Promise<any> => {
          return {
            ...dataObj,
            reportedBy: {
              id: dataObj.reportedBy.id,
              name: dataObj.reportedBy.name,
              lastName: dataObj.reportedBy.lastName,
              email: dataObj.reportedBy.email,
              phone: dataObj.reportedBy.phoneNumber,
            }
          }
        }
      )
    } catch (error) {
      console.log(error);
    }
  }

  async getImage(imageName: string) {  
    const pathFile = path.join(__dirname, `../../../files/${imageName}`);
    if (!fs.existsSync(pathFile)) {
      throw new BadRequestException(`File ${imageName} not found`);
    }
    return pathFile;
  }


  async updateStatus(id: number, statusId: number) {
    this.logger.log(`Usuario ${id} actualizado a estado ${statusId}`);
    try {
      const reportedPerson = await this.reportedPersonRepository.findOne({
        where: { id }
      })
      if (!reportedPerson) {
        throw new BadRequestException({
          title: 'Persona no encontrada',
          message: 'Persona no encontrada',
        });
      }

      reportedPerson.statusId = statusId;
      await this.reportedPersonRepository.save(reportedPerson);
      this.logger.log(`Estado de la persona ${id} actualizado a ${statusId}`);
      return {
        title: 'Estado actualizado',
        message: `Estado de la persona actualizado a ${statusId}`,
        data: reportedPerson,
      }
    } catch (error) {
      console.log(error);
    }
  }
}
