import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WfinstanceService } from './wfinstance.service';
import { WfinstanceController } from './wfinstance.controller';
import { WfinstanceSchema } from './wfinstance.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
import { ParameterModule } from '../parameter/parameter.module';
import { WorkflowModule } from '../workflow/workflow.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { EmailModule } from 'src/emails/email.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Wfinstance', schema: WfinstanceSchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
    ParameterModule, NotificationModule, WorkflowModule, UserModule, EmailModule],
  providers: [WfinstanceService],
  exports: [WfinstanceService],
  controllers: [WfinstanceController],
})
export class WfinstanceModule { }
