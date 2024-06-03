import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { LoggingInterceptor } from '../common/interceptor';
import { Workflow, WorkflowDto } from './workflow.interface';
import { WorkflowService } from './workflow.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/workflow')
export class WorkflowController {

  constructor(private readonly workflowService: WorkflowService) { }

  @Post()
  async create(@Req() req: Request, @Body() workflowDto: any): Promise<Workflow> {
    return this.workflowService.create(workflowDto);
  }

  @Get()
  async getAll(): Promise<Workflow[]> {
    return this.workflowService.getAll();
  }
  @Get('rule/:ruleId')
  async getByRule(@Param('ruleId') ruleId: string): Promise<Workflow> {
    return this.workflowService.getRule(ruleId);
  }

  @Get(':workflowId')
  async getOne(@Param('workflowId') workflowId: string): Promise<Workflow> {
    return this.workflowService.findById(workflowId);
  }

  @Delete(':workflowId')
  async delete(@Param('workflowId') workflowId: string): Promise<Workflow> {
    return this.workflowService.deleteById(workflowId);
  }

  @Put(':workflowId')
  async update(@Param('workflowId') workflowId: string, @Req() req: Request, @Body() workflowDto: any): Promise<Workflow> {
    return this.workflowService.update(workflowId, workflowDto);
  }
}