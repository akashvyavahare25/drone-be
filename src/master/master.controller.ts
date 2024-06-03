import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Master, MasterDto, MasterDetailsDto } from './master.interface';
import { MasterService } from './master.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/master')
export class MasterController {

  constructor(private readonly masterService: MasterService) { }

  @Post()
  async create(@Req() req: Request): Promise<Master> {
    return this.masterService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(@Req() req: Request): Promise<any> {
    return this.masterService.getAll(req.user);
  }

  @Get(':MasterId')
  async getOne(@Param('MasterId') MasterId: string): Promise<Master> {
    return this.masterService.findById(MasterId);
  }

  @Get('fetch/:MasterName')
  async getByName(@Param('MasterName') MasterName: string): Promise<Master> {
    return this.masterService.findByName(MasterName);
  }

  @Delete(':MasterId')
  async delete(@Param('MasterId') MasterId: string): Promise<any> {
    return this.masterService.deleteById(MasterId);
  }

  @Put(':MasterId')
  async update(@Param('MasterId') MasterId: string, @Req() req: Request): Promise<Master> {
    return this.masterService.update(MasterId, req.body);
  }

}