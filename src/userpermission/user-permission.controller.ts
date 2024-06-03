import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { LoggingInterceptor } from '../common/interceptor';
import { UserPermission } from './user-permission.interface';
import { UserPermissionService } from './user-permission.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/user-permission')
export class UserPermissionController {

  constructor(private readonly userPermissionService: UserPermissionService) { }

  @Post()
  async create(@Req() req: Request): Promise<UserPermission> {
    return this.userPermissionService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<UserPermission[]> {
    return this.userPermissionService.getAll();
  }

  @Get(':UserPermissionId')
  async getOne(@Param('UserPermissionId') UserPermissionId: string): Promise<UserPermission> {
    return this.userPermissionService.findById(UserPermissionId);
  }
  // @Get('/by-role/:role')
  // async getPermissionByRole(@Param('role') Role: string): Promise<UserPermission> {
  //   return this.userPermissionService.getPermissionByRole(Role);
  // }
  @Get('/by-role-appName/:role/:appName')
  async getPermissionByRoleAndAppName(@Param('role') Role: string,@Param('appName') AppName: string): Promise<UserPermission> {
    return this.userPermissionService.getPermissionForARoleAndAppName(Role,AppName);
  }

  @Delete(':UserPermissionId')
  async delete(@Param('UserPermissionId') UserPermissionId: string): Promise<UserPermission> {
    return this.userPermissionService.deleteById(UserPermissionId);
  }

  @Put(':UserPermissionId')
  async update(@Param('UserPermissionId') UserPermissionId: string, @Req() req: Request): Promise<UserPermission> {
    return this.userPermissionService.update(UserPermissionId, req.body);
  }
}