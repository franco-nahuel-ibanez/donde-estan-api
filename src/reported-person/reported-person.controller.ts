import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query, Res } from '@nestjs/common';
import { ReportedPersonService } from './reported-person.service';
import { CreateReportedPersonDto } from './dto/create-reported-person.dto';
import { UpdateReportedPersonDto } from './dto/update-reported-person.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../helpers/filerFilter';
import { fileNamer } from '../helpers/fileNamer';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { User } from '../user/entities/user.entity';
import { ReportFilterDto } from './dto/repot-filter.dto';
import { Response } from 'express';


@Controller('reported-person')
export class ReportedPersonController {
  constructor(private readonly reportedPersonService: ReportedPersonService) {}

  @Post('create')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: fileFilter,
    })
  )
  create(
    @Body() createReportedPersonDto: any,
    @UploadedFile() image : Express.Multer.File,
    @GetUser() user: User
  ) {

    return this.reportedPersonService.create(createReportedPersonDto, user, image);
  }

  @Get()
  @UseGuards(AuthGuard())
  getPainaedReportedPersons(
    @GetUser() user: User,
    @Query() reportFilter: ReportFilterDto
  ) {
    return this.reportedPersonService.getPainaedReportedPersons(user, reportFilter);
  }

  @Get('my-reports')
  @UseGuards(AuthGuard())
  getMyReports(
    @GetUser() user: User,
    @Query() reportFilter: ReportFilterDto
  ) {
    console.log("Llego al controlador de my-reports")
    return this.reportedPersonService.getMyReports(user, reportFilter);
  }

  //servir imagenes
  @Get('images/:imageName')
  // @UseGuards(AuthGuard())
  async findImage(
    @Param('imageName') imageName: string,
    // @GetUser() user: User,
    @Res() res: Response,
  ) {
    console.log("Llego al controlador de images")
    const pathImage = await this.reportedPersonService.getImage(
      imageName,
    );
    res.sendFile(pathImage);
  }

  @Post('update-status/:id')
  @UseGuards(AuthGuard())
  updateStatus(
    @Param('id') id: string,
    @Body('statusId') statusId: number, 
  ) {
    return this.reportedPersonService.updateStatus(+id, statusId);
  }
}
