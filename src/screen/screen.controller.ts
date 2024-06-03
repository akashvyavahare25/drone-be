import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { LoggingInterceptor } from 'src/common/interceptor';
import { Screen, ScreenDto } from './screen.interface';
import { ScreenService } from './screen.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/screen')
export class ScreenController {

  constructor(private readonly screenService: ScreenService) { }

  @Post()
  async create(@Req() req: Request, @Body() screenDto: ScreenDto): Promise<Screen> {
    return this.screenService.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<Screen[]> {
    return this.screenService.getAll();
  }

  @Get('/menu')
  async getMenuScreen(): Promise<Screen[]> {
    return this.screenService.getMenuScreen();
  }

  @Get(':ScreenId')
  async getOne(@Param('ScreenId') ScreenId: string): Promise<Screen> {
    return this.screenService.findById(ScreenId);
  }

  @Get('/applicationId/:AppID')
  async getScreenByAppId(@Param('AppID') AppID: string): Promise<Screen[]> {
    return this.screenService.findAppById(AppID);
  }
  @Get('/code/:ScreenCode')
  async getOneByCode(@Param('ScreenCode') ScreenCode: string): Promise<Screen> {
    return this.screenService.findByCode(ScreenCode);
  }

  @Get('/name/:ScreenCode')
  async getScreenByCode(@Param('ScreenCode') ScreenCode: string): Promise<Screen> {
    return this.screenService.findScreenName(ScreenCode);
  }

  @Delete(':ScreenId')
  async delete(@Param('ScreenId') ScreenId: string): Promise<Screen> {
    return this.screenService.deleteById(ScreenId);
  }

  @Put(':ScreenId')
  async update(@Param('ScreenId') ScreenId: string, @Req() req: Request): Promise<Screen> {
    return this.screenService.update(ScreenId, req.body);
  }
}