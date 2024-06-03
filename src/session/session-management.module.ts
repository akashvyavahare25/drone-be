import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SessionManagementService } from './session-management.service';
import { SessionManagementController } from './session-management.controller';
import { SessionManagementSchema } from './session-management.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'SessionManagement', schema: SessionManagementSchema }])],
  providers: [SessionManagementService],
  exports: [SessionManagementService],
  controllers: [SessionManagementController],
})
export class SessionManagementModule { }
