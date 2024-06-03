import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Public, PublicDto } from './public.interface';
import { PublicService } from './public.service';


@Controller('api')
export class PublicController {

  constructor(private readonly publicService: PublicService) { }


  @Get('external/api/:type/:name/:code')
  async getDataExt1(@Param('type') type: string, @Param('name') name: string, @Param('code') code: string): Promise<any> {
    return this.publicService.getDataExt1(type, name, code);
  }

  @Get('external/api/:type/')
  async getDataExt(@Param('type') type: string,@Req() req: Request): Promise<any> {
    return this.publicService.getDataExt(type,req.user);
  }
 
}