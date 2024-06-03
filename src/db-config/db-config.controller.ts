import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { DbConfig } from './db-config.interface';
import { DbConfigService } from './db-config.service'
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/db-config')
export class DbConfigController {

  constructor(private readonly dbConfig: DbConfigService) { }

  @Post()
  async create(@Req() req: Request): Promise<DbConfig> {
    return this.dbConfig.create(req.body);
  }

  // @Roles('admin', 'user')
  @Get()
  async getAll(): Promise<DbConfig[]> {
    return this.dbConfig.getAll();
  }

  @Get('create/:user/:host/:port/:password/:database/:dbtype')
  async getTables(@Param('user') user: string,@Param('host') host: string,@Param('port') port: string,@Param('password') password: string,@Param('database') database: string,@Param('dbtype') dbtype: string): Promise<any> {
    return this.dbConfig.getTables(user,host,port,password,database,dbtype);
  }

  @Get('getpg/:user/:host/:port/:password/:database/:dbtype/:tableName')
  async getExistingTables(@Param('user') user: string,@Param('host') host: string,@Param('port') port: string,@Param('password') password: string,@Param('database') database: string,@Param('dbtype') dbtype: string,@Param('tableName') tableName: string): Promise<any> {
    return this.dbConfig.getExistingTables(user,host,port,password,database,dbtype,tableName);
  }

  @Get(':DbConfigId')
  async getOne(@Param('DbConfigId') DbConfigId: string): Promise<DbConfig> {
    return this.dbConfig.findById(DbConfigId);
  }

  @Delete(':DbConfigId')
  async delete(@Param('DbConfigId') DbConfigId: string): Promise<DbConfig> {
    return this.dbConfig.deleteById(DbConfigId);
  }

  @Put(':DbConfigId')
  async update(@Param('DbConfigId') DbConfigId: string, @Req() req: Request): Promise<DbConfig> {
    return this.dbConfig.update(DbConfigId, req.body);
  }
}