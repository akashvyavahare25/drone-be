import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { WorkflowSchema } from './workflow.schema';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Workflow', schema: WorkflowSchema }]),SessionManagementModule],
  providers: [WorkflowService],
  exports: [WorkflowService],
  controllers: [WorkflowController],
})
export class WorkflowModule { }
