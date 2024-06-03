import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleManagement } from './role-management.interface';
import { RoleManagementService } from './role-management.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/role-management')
export class RoleManagementController {

  constructor(private readonly appMasterService: RoleManagementService) { }

  @Post()
  async create(@Req() req: Request): Promise<RoleManagement> {
    return this.appMasterService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<RoleManagement[]> {
    return this.appMasterService.getAll();
  }

  @Get(':RoleManagementId')
  async getOne(@Param('RoleManagementId') RoleManagementId: string): Promise<RoleManagement> {
    return this.appMasterService.findById(RoleManagementId);
  }
  @Get('appName/:appId')
  async getAllRole(@Param('appId') appId: string): Promise<RoleManagement[]> {
    return this.appMasterService.findByAppId(appId);
  }

  @Delete(':RoleManagementId')
  async delete(@Param('RoleManagementId') RoleManagementId: string): Promise<RoleManagement> {
    return this.appMasterService.deleteById(RoleManagementId);
  }

  @Put(':RoleManagementId')
  async update(@Param('RoleManagementId') RoleManagementId: string, @Req() req: Request): Promise<RoleManagement> {
    return this.appMasterService.update(RoleManagementId, req.body);
  }
}