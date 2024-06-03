import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Hierarchy, HierarchyDto } from './hierarchy.interface';
import { HierarchyService } from './hierarchy.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/hierarchy')
@UseInterceptors(LoggingInterceptor)
export class HierarchyController {

  constructor(private readonly hierarchyService: HierarchyService) { }

  @Post()
  async create(@Req() req: Request, @Body() hierarchyDto: HierarchyDto): Promise<Hierarchy> {
    return this.hierarchyService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<Hierarchy[]> {
    return this.hierarchyService.getAll();
  }

  @Get(':HierarchyId')
  async getOne(@Param('HierarchyId') HierarchyId: string): Promise<Hierarchy> {
    return this.hierarchyService.findById(HierarchyId);
  }

  @Delete(':HierarchyId')
  async delete(@Param('HierarchyId') HierarchyId: string): Promise<Hierarchy> {
    return this.hierarchyService.deleteById(HierarchyId);
  }

  @Put(':HierarchyId')
  async update(@Param('HierarchyId') HierarchyId: string, @Req() req: Request): Promise<Hierarchy> {
    return this.hierarchyService.update(HierarchyId, req.body);
  }
}