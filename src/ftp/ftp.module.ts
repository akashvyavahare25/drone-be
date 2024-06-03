import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FtpService } from './ftp.service';
import { FtpController } from './ftp.controller';
import { FtpSchema } from './ftp.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
import { ParameterModule } from '../parameter/parameter.module';
import { UploadtemplateModule } from '../filetransfer/uploadtemplate.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Ftp', schema: FtpSchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
    ParameterModule, UploadtemplateModule],
  providers: [FtpService],
  exports: [FtpService],
  controllers: [FtpController],
})
export class FtpModule { }
