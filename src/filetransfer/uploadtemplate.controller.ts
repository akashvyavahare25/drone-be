import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Uploadtemplate, UploadtemplateDto } from './uploadtemplate.interface';
import { UploadtemplateService } from './uploadtemplate.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/upload/template')
export class UploadtemplateController {

  constructor(private readonly uploadtemplateService: UploadtemplateService) { }

  @Post()
  async create(@Req() req: Request, @Body() uploadtemplateDto: UploadtemplateDto): Promise<Uploadtemplate> {
    return this.uploadtemplateService.create(req.body);
  }

  @Get()
  async getAll(): Promise<Uploadtemplate[]> {
    return this.uploadtemplateService.getAll();
  }

  @Get(':UploadtemplateId')
  async getOne(@Param('UploadtemplateId') UploadtemplateId: string): Promise<Uploadtemplate> {
    return this.uploadtemplateService.findById(UploadtemplateId);
  }

  @Delete(':UploadtemplateId')
  async delete(@Param('UploadtemplateId') UploadtemplateId: string): Promise<Uploadtemplate> {
    return this.uploadtemplateService.deleteById(UploadtemplateId);
  }

  @Put(':UploadtemplateId')
  async update(@Param('UploadtemplateId') UploadtemplateId: string, @Req() req: Request): Promise<Uploadtemplate> {
    return this.uploadtemplateService.update(UploadtemplateId, req.body);
  }
}