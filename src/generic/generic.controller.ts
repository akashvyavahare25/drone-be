import {Controller, Get, Post, Req, Param, UseGuards, Body, Delete} from '@nestjs/common';
import { Request } from 'express';
import { GenericService } from './generic.service';
//import { ApiUseTags } from '@nestjs/swagger';

@Controller('api/model')
export class GenericController {
  constructor(private readonly genericService: GenericService) {}

  @Post(':model')
  async createDocument(@Body() document: any, @Param('model') model: string) {
    return this.genericService.create(model, document );
  }

  @Get(':model')
  async fetchDocuments(@Param('model') model: string) {
    return this.genericService.getAll(model);
  }

  @Get(':model/:id')
  async fetchDocument(@Param('model') model: string, @Param('id') id: string): Promise<any> {
    return this.genericService.getOneById(model, id);
  }

  @Delete(':model/:id')
  async deleteDocument(@Param('model') model: string, @Param('id') id: string): Promise<any> {
    return this.genericService.deleteById(model, id);
  }

}
