import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardSchema } from './dashboard.schema';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Dashboard', schema: DashboardSchema }]),SessionManagementModule],
  providers: [DashboardService],
  exports: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule { }
