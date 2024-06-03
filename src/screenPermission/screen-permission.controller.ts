import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ScreenPermission } from './screen-permission.interface';
import { ScreenPermissionService } from './screen-permission.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/screen-permission')
export class ScreenPermissionController {

  constructor(private readonly appMasterService: ScreenPermissionService) { }

  @Post()
  async create(@Req() req: Request): Promise<ScreenPermission> {
    return this.appMasterService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<ScreenPermission[]> {
    return this.appMasterService.getAll();
  }

  @Get(':ScreenPermissionId')
  async getOne(@Param('ScreenPermissionId') ScreenPermissionId: string): Promise<ScreenPermission> {
    return this.appMasterService.findById(ScreenPermissionId);
  }
  @Get('role/:screen/:role')
  async getDetails(@Param('screen') screen: string,@Param('role') role: string): Promise<any> {
    return this.appMasterService.getByNameAndRoleName(screen,role);
  }
  @Get('code/:appId')
  async findByCode(@Param('appId') appId: string): Promise<ScreenPermission> {
    return this.appMasterService.findByCode(appId);
  }

  

  @Delete(':ScreenPermissionId')
  async delete(@Param('ScreenPermissionId') ScreenPermissionId: string): Promise<ScreenPermission> {
    return this.appMasterService.deleteById(ScreenPermissionId);
  }

  @Put(':ScreenPermissionId')
  async update(@Param('ScreenPermissionId') ScreenPermissionId: string, @Req() req: Request): Promise<ScreenPermission> {
    return this.appMasterService.update(ScreenPermissionId, req.body);
  }
}