import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VisualChartService } from './visual-chart.service';
import { VisualChartController } from './visual-chart.controller';
import { VisualChartSchema } from './visual-chart.schema';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'VisualChart', schema: VisualChartSchema }]),SessionManagementModule],
  providers: [VisualChartService],
  exports: [VisualChartService],
  controllers: [VisualChartController],
})
export class VisualChartModule { }
