import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { VisualChart } from './visual-chart.interface';
import { VisualChartService } from './visual-chart.service';
import { LoggingInterceptor } from '../common/interceptor';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/visual-chart')
export class VisualChartController {

  constructor(private readonly visualChartService: VisualChartService) { }

  @Post()
  async create(@Req() req: Request): Promise<VisualChart> {
    return this.visualChartService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<VisualChart[]> {
    return this.visualChartService.getAll();
  }

  @Get(':VisualChartId')
  async getOne(@Param('VisualChartId') VisualChartId: string): Promise<VisualChart> {
    return this.visualChartService.findById(VisualChartId);
  }

  @Delete(':VisualChartId')
  async delete(@Param('VisualChartId') VisualChartId: string): Promise<any> {
    return this.visualChartService.deleteById(VisualChartId);
  }

  @Put(':VisualChartId')
  async update(@Param('VisualChartId') VisualChartId: string, @Req() req: Request): Promise<VisualChart> {
    return this.visualChartService.update(VisualChartId, req.body);
  }
}