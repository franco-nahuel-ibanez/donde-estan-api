import { Injectable } from '@nestjs/common';
import { CreateReportedPersonDto } from './dto/create-reported-person.dto';
import { UpdateReportedPersonDto } from './dto/update-reported-person.dto';

@Injectable()
export class ReportedPersonService {
  create(createReportedPersonDto: CreateReportedPersonDto) {
    return 'This action adds a new reportedPerson';
  }

  findAll() {
    return `This action returns all reportedPerson`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportedPerson`;
  }

  update(id: number, updateReportedPersonDto: UpdateReportedPersonDto) {
    return `This action updates a #${id} reportedPerson`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportedPerson`;
  }
}
