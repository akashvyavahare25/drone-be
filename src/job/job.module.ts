import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobSchema } from './job.schema';
import { ApiinterfaceModule } from '../apiinterface/apiinterface.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),SessionManagementModule,
  forwardRef(() => ApiinterfaceModule)],
  providers: [JobService],
  exports: [JobService],
  controllers: [JobController],
})
export class JobModule { }
