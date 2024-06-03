import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, UploadedFiles, Res, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { TriggerScreenJob, TriggerScreenJobDto } from './trigger-screen-job.interface';
import {TriggerScreenJobService } from './trigger-screen-job.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LoggingInterceptor } from '../common/interceptor';

const multer = require('multer');


@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/trigger/job')
export class TriggerScreenJobController {

  constructor(private readonly jobService: TriggerScreenJobService) { }

  @Post()
  async create(@Req() req: Request, @Body() jobDto: TriggerScreenJobDto): Promise<TriggerScreenJob> {
    return this.jobService.create(req.body);
  }

  @Get()
  async getAll(): Promise<TriggerScreenJobDto[]> {
    return this.jobService.getAll();
  }

  @Get(':jobId')
  async getOne(@Param('jobId') jobId: string): Promise<TriggerScreenJob> {
    return this.jobService.findById(jobId);
  }

  @Delete(':jobId')
  async delete(@Param('jobId') jobId: string): Promise<TriggerScreenJob> {
    return this.jobService.deleteById(jobId);
  }

  @Put(':jobId')
  async update(@Param('jobId') jobId: string, @Req() req: Request): Promise<TriggerScreenJob> {
    return this.jobService.update(jobId, req.body);
  }
}