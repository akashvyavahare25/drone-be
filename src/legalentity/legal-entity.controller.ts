import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { LegalEntity } from './legal-entity.interface';
import { LegalEntityService } from './legal-entity.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/legal-entity')
export class LegalEntityController {

  constructor(private readonly appMasterService: LegalEntityService) { }

  @Post()
  async create(@Req() req: Request): Promise<LegalEntity> {
    return this.appMasterService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<LegalEntity[]> {
    return this.appMasterService.getAll();
  }

  @Get(':LegalEntityId')
  async getOne(@Param('LegalEntityId') LegalEntityId: string): Promise<LegalEntity> {
    return this.appMasterService.findById(LegalEntityId);
  }

  @Delete(':LegalEntityId')
  async delete(@Param('LegalEntityId') LegalEntityId: string): Promise<LegalEntity> {
    return this.appMasterService.deleteById(LegalEntityId);
  }

  @Put(':LegalEntityId')
  async update(@Param('LegalEntityId') LegalEntityId: string, @Req() req: Request): Promise<LegalEntity> {
    return this.appMasterService.update(LegalEntityId, req.body);
  }
}