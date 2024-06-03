import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleManagementService } from './role-management.service';
import { RoleManagementController } from './role-management.controller';
import { RoleManagementSchema } from './role-management.schema';
import { SessionManagementModule } from '../session/session-management.module';
import { AppMasterModule } from '../appmaster/app-master.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'RoleManagement', schema: RoleManagementSchema }]),SessionManagementModule,AppMasterModule],
  providers: [RoleManagementService],
  exports: [RoleManagementService],
  controllers: [RoleManagementController],
})
export class RoleManagementModule { }
