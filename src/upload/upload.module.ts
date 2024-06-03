import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UploadSchema } from './upload.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
import { ParameterModule } from '../parameter/parameter.module';
import { ScreenModule } from '../screen/screen.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Upload', schema: UploadSchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
  forwardRef(() => ScreenModule),
    ParameterModule],
  providers: [UploadService],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule { }
