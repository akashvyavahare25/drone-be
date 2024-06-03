import * as path from 'path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nest-modules/mailer';
import { ServeStaticMiddleware } from '@nest-middlewares/serve-static';
import { MorganModule } from 'nest-morgan';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
//import { GlobalAccessLogger } from './common/accessLogger';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MasterModule } from './master/master.module';
import { DynaSchemaModule } from './dynaschema/dynaschema.module';
import { ParameterModule } from './parameter/parameter.module';
import { WorkflowModule } from './workflow/workflow.module';
import { ScreenModule } from './screen/screen.module';
import { AppMasterModule } from './appmaster/app-master.module';
import { UserPermissionModule } from './userpermission/user-permission.module';
import { FunctionModule } from './function/function.module';
import { ReportModule } from './report/report.module';
import { ApiinterfaceModule } from './apiinterface/apiinterface.module';
import { HierarchyModule } from './hierarchy/hierarchy.module';
import { WfinstanceModule } from './wfinstance/wfinstance.module';
import { NotificationModule } from './notification/notification.module';
import { UploadModule } from './upload/upload.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { JobModule } from './job/job.module';
import { VisualModule } from './visual/visual.module';
import { PublicModule } from './public/public.module';
import { RulesModule } from './rules/rules.module';
import { CustomerModule } from './customer/customer.module'
import { UploadtemplateModule } from './filetransfer/uploadtemplate.module'
import { FtpModule } from './ftp/ftp.module'
import { TriggerScreenJobModule } from './triggersjob/trigger-screen-job.module'
import config from './config';
import { GenericModule } from './generic/generic.module';
import { fromPairs } from 'lodash';
import { LegalEntityModule } from './legalentity/legal-entity.module';
import { RoleManagementModule } from './rolemanagement/role-management.module';
import { ScreenPermissionModule } from './screenPermission/screen-permission.module';
import {DbConfigModule} from './db-config/db-config.module'
import { ApiConfigModule } from './api-config/api-config.module';
import { VisualChartModule } from './visual-chart/visual-chart.module';
import { ThemeModule } from './user-theme/theme.module';
const DEV_TRANSPORTER = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'ethereal.user@ethereal.email',
    pass: 'verysecret',
  },
};

@Module({
  imports: [
    AuthModule,
    MorganModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: process.env.MAILGUN_TRANSPORT || DEV_TRANSPORTER,
        defaults: {
          from: config.mail.from,
        },
      }),
    }),
    UserModule,
    DynaSchemaModule,
    GenericModule,
    ParameterModule,
    MasterModule,
    WorkflowModule,
    ScreenModule,
    AppMasterModule,
    UserPermissionModule,
    FunctionModule,
    ReportModule,
    HierarchyModule,
    WfinstanceModule,
    NotificationModule,
    ApiinterfaceModule,
    UploadModule,
    DashboardModule,
    JobModule,
    VisualModule,
    PublicModule,
    RulesModule,
    CustomerModule,
    UploadtemplateModule,
    FtpModule,
    TriggerScreenJobModule,
   RoleManagementModule,
   LegalEntityModule,
   ScreenPermissionModule,
   DbConfigModule,
   ApiConfigModule,
   VisualChartModule,
   ThemeModule,
  ],
  //providers: config.isTest() ? undefined : [GlobalAccessLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    ServeStaticMiddleware.configure(
      path.resolve(__dirname, '..', 'public'),
      config.static,
    );
    consumer.apply(ServeStaticMiddleware).forRoutes('public');
    ServeStaticMiddleware.configure(
      path.resolve(__dirname, '..', 'logo_images'),
      config.static,
    );
    consumer.apply(ServeStaticMiddleware).forRoutes('logo_images');
    if (!config.isTest()) {
      consumer.apply(LoggerMiddleware).forRoutes('api');
    }
  }
}
