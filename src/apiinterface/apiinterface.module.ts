import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApiinterfaceService } from './apiinterface.service';
import { ApiinterfaceController } from './apiinterface.controller';
import { ApiinterfaceSchema } from './apiinterface.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
import { ParameterModule } from '../parameter/parameter.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Apiinterface', schema: ApiinterfaceSchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
    ParameterModule],
  providers: [ApiinterfaceService],
  exports: [ApiinterfaceService],
  controllers: [ApiinterfaceController],
})
export class ApiinterfaceModule { }
