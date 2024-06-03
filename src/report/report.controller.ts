import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Report, ReportDto } from './report.interface';
import { ReportService } from './report.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/report')
export class ReportController {

  constructor(private readonly reportService: ReportService) { }

  @Post()
  async create(@Req() req: Request, @Body() reportDto: ReportDto): Promise<Report> {
    return this.reportService.create(req.body);
  }

  @Post('query-test')
  async queryTest(@Req() req: Request, @Body() reportDto: ReportDto): Promise<Report> {
    return this.reportService.queryTest(req.body);
  }

  @Post('get-report-screendata')
  async getReportByScreenData(@Req() req: Request): Promise<Report> {
    return this.reportService.getReportByScreenData(req.body);
  }

  @Get()
  async getAll(): Promise<Report[]> {
    return this.reportService.getAll();
  }

  @Get(':ReportId')
  async getOne(@Param('ReportId') ReportId: string): Promise<Report> {
    return this.reportService.findById(ReportId);
  }

  @Delete(':ReportId')
  async delete(@Param('ReportId') ReportId: string): Promise<Report> {
    return this.reportService.deleteById(ReportId);
  }

  @Put(':ReportId')
  async update(@Param('ReportId') ReportId: string, @Req() req: Request): Promise<Report> {
    return this.reportService.update(ReportId, req.body);
  }
}