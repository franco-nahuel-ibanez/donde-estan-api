import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MobileVersionsService } from './mobile-versions.service';
import { CreateMobileVersionDto } from './dto/create-mobile-version.dto';
import { UpdateMobileVersionDto } from './dto/update-mobile-version.dto';

@Controller('mobile-versions')
export class MobileVersionsController {
  constructor(private readonly mobileVersionsService: MobileVersionsService) {}

  @Post()
  create(@Body() createMobileVersionDto: CreateMobileVersionDto) {
    return this.mobileVersionsService.create(createMobileVersionDto);
  }

  @Get()
  findAll() {
    return this.mobileVersionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mobileVersionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMobileVersionDto: UpdateMobileVersionDto) {
    return this.mobileVersionsService.update(+id, updateMobileVersionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mobileVersionsService.remove(+id);
  }
}
