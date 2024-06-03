import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Function } from './function.interface';
import { FunctionService } from './function.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/function')
export class FunctionController {

  constructor(private readonly functionService: FunctionService) { }

  @Post()
  async create(@Req() req: Request): Promise<Function> {
    return this.functionService.create(req.body);
  }

  @Get()
  async getAll(): Promise<Function[]> {
    return this.functionService.getAll();
  }

  @Get(':FunctionId')
  async getOne(@Param('FunctionId') FunctionId: string): Promise<Function> {
    return this.functionService.findById(FunctionId);
  }

  @Get('/by-name/:name')
  async getFunctionByName(@Param('name') Name: string): Promise<Function> {
    return this.functionService.getFunctionByName(Name);
  }

  @Delete(':FunctionId')
  async delete(@Param('FunctionId') FunctionId: string): Promise<Function> {
    return this.functionService.deleteById(FunctionId);
  }

  @Put(':FunctionId')
  async update(@Param('FunctionId') FunctionId: string, @Req() req: Request): Promise<Function> {
    return this.functionService.update(FunctionId, req.body);
  }
}