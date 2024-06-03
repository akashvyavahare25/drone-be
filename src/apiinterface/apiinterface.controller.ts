import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Apiinterface, ApiinterfaceDto } from './apiinterface.interface';
import { ApiinterfaceService } from './apiinterface.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/apiinterface')
export class ApiinterfaceController {

  constructor(private readonly apiinterfaceService: ApiinterfaceService) { }

  @Post()
  async create(@Req() req: Request, @Body() apiinterfaceDto: ApiinterfaceDto): Promise<Apiinterface> {
    return this.apiinterfaceService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<Apiinterface[]> {
    return this.apiinterfaceService.getAll();
  }

  @Get(':ApiinterfaceId')
  async getOne(@Param('ApiinterfaceId') ApiinterfaceId: string): Promise<Apiinterface> {
    return this.apiinterfaceService.findById(ApiinterfaceId);
  }

  @Post('test-api-interface/')
  async getRes(@Req() req: Request, @Body() apiinterfaceDto: ApiinterfaceDto): Promise<Apiinterface> {
    return this.apiinterfaceService.getRes(req.body);
 }

  @Delete(':ApiinterfaceId')
  async delete(@Param('ApiinterfaceId') ApiinterfaceId: string): Promise<Apiinterface> {
    return this.apiinterfaceService.deleteById(ApiinterfaceId);
  }

  @Put(':ApiinterfaceId')
  async update(@Param('ApiinterfaceId') ApiinterfaceId: string, @Req() req: Request): Promise<Apiinterface> {
    return this.apiinterfaceService.update(ApiinterfaceId, req.body);
  }
}