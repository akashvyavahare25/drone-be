import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { SessionManagement } from './session-management.interface';
import { SessionManagementService } from './session-management.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/session-management')
export class SessionManagementController {

  constructor(private readonly appMasterService: SessionManagementService) { }

  @Post()
  async create(@Req() req: Request): Promise<SessionManagement> {
    return this.appMasterService.create(req.body);
  }

  // @Sessions('admin', 'user')
  @Get()
  async getAll(): Promise<SessionManagement[]> {
    return this.appMasterService.getAll();
  }

  // @Get(':SessionManagementId')
  // async getOne(@Param('SessionManagementId') SessionManagementId: string): Promise<SessionManagement> {
  //   return this.appMasterService.findById(SessionManagementId);
  // }
  @Get('appName/:appId')
  async getAllSession(@Param('appId') appId: string): Promise<SessionManagement[]> {
    return this.appMasterService.findByAppId(appId);
  }

  @Delete(':SessionManagementId')
  async delete(@Param('SessionManagementId') SessionManagementId: string): Promise<SessionManagement> {
    return this.appMasterService.deleteById(SessionManagementId);
  }

  @Put(':SessionManagementId')
  async update(@Param('SessionManagementId') SessionManagementId: string, @Req() req: Request): Promise<SessionManagement> {
    return this.appMasterService.update(SessionManagementId, req.body);
  }
}