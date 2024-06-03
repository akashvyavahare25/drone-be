import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TriggerScreenJobService } from './trigger-screen-job.service';
import { TriggerScreenJobController } from './trigger-screen-job.controller';
import { TriggerScreenJobSchema } from './trigger-screen-job.schema';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'TriggerScreenJob', schema: TriggerScreenJobSchema }]),SessionManagementModule],
  providers: [TriggerScreenJobService],
  exports: [TriggerScreenJobService],
  controllers: [TriggerScreenJobController],
})
export class TriggerScreenJobModule { }
