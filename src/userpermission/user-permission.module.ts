import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { UserPermissionSchema } from './user-permission.schema';
import { SessionManagementModule } from '../session/session-management.module';
@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'UserPermission', schema: UserPermissionSchema }]),SessionManagementModule],
  providers: [UserPermissionService],
  exports: [UserPermissionService],
  controllers: [UserPermissionController],
})
export class UserPermissionModule { }
