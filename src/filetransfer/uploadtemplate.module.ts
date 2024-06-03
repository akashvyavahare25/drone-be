import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UploadtemplateService } from './uploadtemplate.service';
import { UploadtemplateController } from './uploadtemplate.controller';
import { UploadtemplateSchema } from './uploadtemplate.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
import { ParameterModule } from '../parameter/parameter.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Uploadtemplate', schema: UploadtemplateSchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
    ParameterModule],
  providers: [UploadtemplateService],
  exports: [UploadtemplateService],
  controllers: [UploadtemplateController],
})
export class UploadtemplateModule { }
