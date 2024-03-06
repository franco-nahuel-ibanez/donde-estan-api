import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportedPersonService } from './reported-person.service';
import { CreateReportedPersonDto } from './dto/create-reported-person.dto';
import { UpdateReportedPersonDto } from './dto/update-reported-person.dto';

@Controller('reported-person')
export class ReportedPersonController {
  constructor(private readonly reportedPersonService: ReportedPersonService) {}

  @Post()
  create(@Body() createReportedPersonDto: CreateReportedPersonDto) {
    return this.reportedPersonService.create(createReportedPersonDto);
  }

  @Get()
  findAll() {
    return this.reportedPersonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportedPersonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportedPersonDto: UpdateReportedPersonDto) {
    return this.reportedPersonService.update(+id, updateReportedPersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportedPersonService.remove(+id);
  }
}
