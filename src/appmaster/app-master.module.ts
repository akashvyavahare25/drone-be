import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppMasterService } from './app-master.service';
import { AppMasterController } from './app-master.controller';
import { AppMasterSchema } from './app-master.schema';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'AppMaster', schema: AppMasterSchema }]),SessionManagementModule],
  providers: [AppMasterService],
  exports: [AppMasterService],
  controllers: [AppMasterController],
})
export class AppMasterModule { }
