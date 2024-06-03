import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, UploadedFiles, Res, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Visual, VisualDto } from './visual.interface';
import { VisualService } from './visual.service';
import { DynaSchemaService } from 'src/dynaschema/dynaschema.service';
import { LoggingInterceptor } from '../common/interceptor';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/visual')
export class VisualController {

  constructor(private readonly visualService: VisualService, private readonly dynaSchemaService: DynaSchemaService) { }

  @Post()
  async create(@Req() req: Request, @Body() visualDto: VisualDto): Promise<Visual> {
    return this.visualService.create(req.body);
  }

  @Get()
  async getAll(): Promise<Visual[]> {
    return this.visualService.getAll();
  }

  @Get(':VisualId')
  async getOne(@Param('VisualId') VisualId: string): Promise<Visual> {
    return this.visualService.findById(VisualId);
  }

  @Delete(':VisualId')
  async delete(@Param('VisualId') VisualId: string): Promise<Visual> {
    return this.visualService.deleteById(VisualId);
  }

  @Put(':VisualId')
  async update(@Param('VisualId') VisualId: string, @Req() req: Request): Promise<Visual> {
    return this.visualService.update(VisualId, req.body);
  }

}