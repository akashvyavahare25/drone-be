import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { MasterSchema } from './master.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module'
import { ParameterModule } from '../parameter/parameter.module'
import { SessionManagementModule } from '../session/session-management.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Master', schema: MasterSchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
    ParameterModule],
  providers: [MasterService],
  exports: [MasterService],
  controllers: [MasterController],
})
export class MasterModule { }
