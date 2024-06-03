import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DynaSchemaService } from './dynaschema.service';
import { DynaSchemaController } from './dynaschema.controller';
import { DynaSchemaSchema } from './dynaschema.schema';
import { MasterModule } from '../master/master.module';
import { ScreenModule } from '../screen/screen.module';
import { ReportModule } from '../report/report.module';
import { MulterModule } from '@nestjs/platform-express';
import { WorkflowModule } from '../workflow/workflow.module';
import { WfinstanceModule } from '../wfinstance/wfinstance.module';
import { EmailModule } from '../emails/email.module';
import { RulesModule } from '../rules/rules.module'
import {UserModule} from '../user/user.module'
import { ScreenPermissionModule } from '../screenPermission/screen-permission.module';
import { SessionManagementModule } from '../session/session-management.module';
import { DbConfigModule } from '../db-config/db-config.module';
import { ApiConfigModule } from 'src/api-config/api-config.module';
import { UploadModule } from 'src/upload/upload.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'DynaSchema', schema: DynaSchemaSchema }]),
  forwardRef(() => MasterModule),
  forwardRef(() => ScreenModule),
  forwardRef(() => ReportModule),
    WorkflowModule, WfinstanceModule, EmailModule,UploadModule, ApiConfigModule,DbConfigModule, RulesModule,UserModule,ScreenPermissionModule,SessionManagementModule,
  MulterModule.register({
    dest: 'upload',
  })],
  providers: [DynaSchemaService],
  exports: [DynaSchemaService],
  controllers: [DynaSchemaController],
})
export class DynaSchemaModule { }
