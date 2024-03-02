import { Injectable } from '@nestjs/common';
import { CreateMobileVersionDto } from './dto/create-mobile-version.dto';
import { UpdateMobileVersionDto } from './dto/update-mobile-version.dto';

@Injectable()
export class MobileVersionsService {
  create(createMobileVersionDto: CreateMobileVersionDto) {
    return 'This action adds a new mobileVersion';
  }

  findAll() {
    return `This action returns all mobileVersions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mobileVersion`;
  }

  update(id: number, updateMobileVersionDto: UpdateMobileVersionDto) {
    return `This action updates a #${id} mobileVersion`;
  }

  remove(id: number) {
    return `This action removes a #${id} mobileVersion`;
  }
}
