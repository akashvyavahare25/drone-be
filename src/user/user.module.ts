import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller'
import { UserService } from './user.service';
import { userRoleIdSchema, UserSchema } from './user.schema';
import { UserMailerService } from './user.mailer.service';
import { MulterModule } from '@nestjs/platform-express';
import {CustomerModule} from '../customer/customer.module'
import { AppMasterModule } from '../appmaster/app-master.module';
import { SessionManagementModule } from '../session/session-management.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  MongooseModule.forFeature([{ name: 'RoleIdCollection', schema: userRoleIdSchema }]),forwardRef(() => CustomerModule),SessionManagementModule,
  AppMasterModule, MulterModule.register({
    dest: 'users',
  })],
  providers: [UserMailerService, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
