import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AppMaster } from './app-master.interface';
import { AppMasterService } from './app-master.service';
import { LoggingInterceptor } from '../common/interceptor';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/app-master')
export class AppMasterController {

  constructor(private readonly appMasterService: AppMasterService) { }

  @Post()
  async create(@Req() req: Request): Promise<AppMaster> {
    return this.appMasterService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<AppMaster[]> {
    return this.appMasterService.getAll();
  }

  @Get('/menu')
  async getAllMenu():Promise<AppMaster[]> {
    return this.appMasterService.getAllMenu();
  }

  @Get(':AppMasterId')
  async getOne(@Param('AppMasterId') AppMasterId: string): Promise<AppMaster> {
    return this.appMasterService.findById(AppMasterId);
  }

  @Delete(':AppMasterId')
  async delete(@Param('AppMasterId') AppMasterId: string): Promise<any> {
    return this.appMasterService.deleteById(AppMasterId);
  }

  @Put(':AppMasterId')
  async update(@Param('AppMasterId') AppMasterId: string, @Req() req: Request): Promise<AppMaster> {
    return this.appMasterService.update(AppMasterId, req.body);
  }
}