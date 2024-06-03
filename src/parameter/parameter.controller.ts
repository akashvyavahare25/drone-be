import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Parameter, ParameterDto, ParameterCollection, } from './parameter.interface';
import { ParameterService } from './parameter.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/parameter')
export class ParameterController {

  constructor(private readonly parameterService: ParameterService) { }

  @Post()
  async create(@Req() req: Request, @Body() parameterDto: ParameterDto): Promise<Parameter> {
    return this.parameterService.create(parameterDto);
  }

  // @Roles('admin', 'user', 'SO')
  @Get()
  async getAll(): Promise<Parameter[]> {
    return this.parameterService.getAll();
  }

  @Get(':parameterId')
  async getOne(@Param('parameterId') parameterId: string): Promise<Parameter> {
    return this.parameterService.findById(parameterId);
  }

  @Delete(':parameterId')
  async delete(@Param('parameterId') parameterId: string): Promise<Parameter> {
    return this.parameterService.deleteById(parameterId);
  }

  @Put(':parameterId')
  async update(@Param('parameterId') parameterId: string, @Req() req: Request, @Body() parameterDto: ParameterDto): Promise<Parameter> {
    return this.parameterService.update(parameterId, parameterDto);
  }

  @Post('collection')
  async createParameterCollections(@Req() req: Request, @Body() parameterCollection: any): Promise<ParameterCollection> {
    return this.parameterService.createPCollections(parameterCollection)
  }

  @Get('collection/:parameterCode')
  async getOneParameterCollections(@Param('parameterCode') parameterCode: string): Promise<ParameterCollection[]> {
    return this.parameterService.getAllPCollectionByParameterCode(parameterCode);
  }

  @Delete('collection/:masterScreenId')
  async deleteParameterCollections(@Param('masterScreenId') masterScreenId: string): Promise<ParameterCollection[]> {
    return this.parameterService.deleteByIdPCollection(masterScreenId);
  }

}