import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { RolesGuard } from '../common/guards/roles.guard';
 
import { ThemeService } from './theme.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/theme')
  export class ThemeController {
    constructor(private readonly themeService: ThemeService) {}
    @Post()
    async create(@Req() req: Request): Promise<any> {
      
      return this.themeService.create(req);
    }
  
    // @Roles('admin', 'user')
    @Get()
    async getAll(): Promise<any[]> {
      return this.themeService.getAll();
    }
  
    @Get(':userId')
    async getOne(@Param('userId') userId: string): Promise<any> {
      return this.themeService.findById(userId);
    }
  
    @Delete(':LegalEntityId')
    async delete(@Param('LegalEntityId') LegalEntityId: string): Promise<any> {
      return this.themeService.deleteById(LegalEntityId);
    }
  
    @Put(':LegalEntityId')
    async update(@Param('LegalEntityId') LegalEntityId: string, @Req() req: Request): Promise<any> {
      return this.themeService.update(LegalEntityId, req.body);
    }
  }
  