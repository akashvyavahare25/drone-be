import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Job, JobDto } from './job.interface';
import { JobService } from './job.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/job')
export class JobController {

  constructor(private readonly jobService: JobService) { }

  @Post()
  async create(@Req() req: Request, @Body() jobDto: any): Promise<Job> {
    return this.jobService.create(jobDto);
  }

  @Get()
  async getAll(): Promise<Job[]> {
    return this.jobService.getAll();
  }

  @Get('fetch/:jobName')
  async getByName(@Param('jobName') jobName: string): Promise<Job> {
    return this.jobService.findByName(jobName);
  }

  @Get('data/:jobName')
  async getDataByName(@Param('jobName') jobName: string): Promise<any> {
    return this.jobService.findDataByName(jobName);
  }

  @Get(':jobId')
  async getOne(@Param('jobId') jobId: string): Promise<Job> {
    return this.jobService.findById(jobId);
  }

  @Get('/code/:JobCode')
  async getOneByCode(@Param('JobCode') JobCode: string): Promise<Job> {
    return this.jobService.findByCode(JobCode);
  }



  @Put(':jobId')
  async update(@Param('jobId') jobId: string, @Body() jobDto: any): Promise<Job> {
    return this.jobService.update(jobId, jobDto);
  }

  @Delete(':jobId')
  async delete(@Param('jobId') jobId: string): Promise<Job> {
    return this.jobService.deleteById(jobId);
  }
}