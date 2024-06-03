import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { LoggingInterceptor } from '../common/interceptor';
import { Rules, RulesDto } from './rules.interface';
import { RulesService } from './rules.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/rules')
export class RulesController {

  constructor(private readonly rulesService: RulesService) { }

  @Post()
  async create(@Req() req: Request, @Body() rulesDto: RulesDto): Promise<Rules> {
    return this.rulesService.create(req.body);
  }

  @Post('query-test')
  async queryTest(@Req() req: Request, @Body() rulesDto: RulesDto): Promise<Rules> {
    return this.rulesService.queryTest(req.body);
  }

  @Post('get-rules-screendata')
  async getRulesByScreenData(@Req() req: Request): Promise<Rules> {
    return this.rulesService.getRulesByScreenData(req.body);
  }

  @Get()
  async getAll(): Promise<Rules[]> {
    return this.rulesService.getAll();
  }

  @Get(':RulesId')
  async getOne(@Param('RulesId') RulesId: string): Promise<Rules> {
    return this.rulesService.findById(RulesId);
  }
  @Get('/code/:Dataset')
  async findByCode(@Param('Dataset') Dataset: string): Promise<Rules[]> {
    return this.rulesService.findByScreenCode(Dataset);
  }

  @Delete(':RulesId')
  async delete(@Param('RulesId') RulesId: string): Promise<Rules> {
    return this.rulesService.deleteById(RulesId);
  }

  @Put(':RulesId')
  async update(@Param('RulesId') RulesId: string, @Req() req: Request): Promise<Rules> {
    return this.rulesService.update(RulesId, req.body);
  }
}