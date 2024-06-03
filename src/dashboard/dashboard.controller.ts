import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Dashboard, DashboardDto } from './dashboard.interface';
import { DashboardService } from './dashboard.service';
@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/dashboard')
export class DashboardController {

  constructor(private readonly dashboardService: DashboardService) { }

  @Post()
  async create(@Req() req: Request, @Body() dashboardDto: any): Promise<Dashboard> {
    return this.dashboardService.create(dashboardDto);
  }

  @Get()
  async getAll(): Promise<Dashboard[]> {
    return this.dashboardService.getAll();
  }

  @Get('/menu')
  async getMenuData(): Promise<Dashboard[]> {
    return this.dashboardService.getMenuData();
  }
  
  @Get(':dashboardId')
  async getOne(@Param('dashboardId') dashboardId: string): Promise<Dashboard> {
    return this.dashboardService.findById(dashboardId);
  }

  @Put(':dashboardId')
  async update(@Param('dashboardId') dashboardId: string, @Body() dashboardDto: any): Promise<Dashboard> {
    return this.dashboardService.update(dashboardId, dashboardDto);
  }

  @Delete(':dashboardId')
  async delete(@Param('dashboardId') dashboardId: string): Promise<Dashboard> {
    return this.dashboardService.deleteById(dashboardId);
  }
}