import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiConfigService } from './api-config.service';
import { ApiConfig } from './api-config.interface';


@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/api-config')
export class ApiConfigController {

  constructor(private readonly apiConfig: ApiConfigService) { }

  @Post()
  async create(@Req() req: Request): Promise<ApiConfig> {
    return this.apiConfig.create(req.body);
  }

  @Get()
  async getAll(): Promise<ApiConfig[]> {
    return this.apiConfig.getAll();
  }

  @Get(':ApiConfigId')
  async getOne(@Param('ApiConfigId') ApiConfigId: string): Promise<ApiConfig> {
    return this.apiConfig.findById(ApiConfigId);
  }

  @Delete(':ApiConfigId')
  async delete(@Param('ApiConfigId') ApiConfigId: string): Promise<ApiConfig> {
    return this.apiConfig.deleteById(ApiConfigId);
  }

  @Put(':ApiConfigId')
  async update(@Param('ApiConfigId') ApiConfigId: string, @Req() req: Request): Promise<ApiConfig> {
    return this.apiConfig.update(ApiConfigId, req.body);
  }
}