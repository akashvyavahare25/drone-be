import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, UploadedFiles, Res, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Ftp, FtpDto } from './ftp.interface';
import { FtpService } from './ftp.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LoggingInterceptor } from '../common/interceptor';

const multer = require('multer');


@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/ftp')
export class FtpController {

  constructor(private readonly ftpService: FtpService) { }

  @Post()
  async create(@Req() req: Request, @Body() ftpDto: FtpDto): Promise<Ftp> {
    return this.ftpService.create(req.body);
  }

  @Get()
  async getAll(): Promise<Ftp[]> {
    return this.ftpService.getAll();
  }

  @Get(':ftpId')
  async getOne(@Param('ftpId') ftpId: string): Promise<Ftp> {
    return this.ftpService.findById(ftpId);
  }

  @Delete(':ftpId')
  async delete(@Param('ftpId') ftpId: string): Promise<Ftp> {
    return this.ftpService.deleteById(ftpId);
  }

  @Put(':ftpId')
  async update(@Param('ftpId') ftpId: string, @Req() req: Request): Promise<Ftp> {
    return this.ftpService.update(ftpId, req.body);
  }

  @Post('/file-upload')
  @UseInterceptors(FilesInterceptor('files'))
  async ftpFileUpload(@Req() req: any): Promise<any> {
    // console.log(req.body.dataset, ' req.body req.files', req.files);
    return this.ftpService.ftpFileUpload(req.files, req.body.dataset);
  }

}