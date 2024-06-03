import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScreenPermissionService } from './screen-permission.service';
import {ScreenPermissionController } from './screen-permission.controller';
import { ScreenPermissionSchema } from './screen-permission.schema';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ScreenPermission', schema: ScreenPermissionSchema }]),SessionManagementModule],
  providers: [ScreenPermissionService],
  exports: [ScreenPermissionService],
  controllers: [ScreenPermissionController],
})
export class ScreenPermissionModule { }
