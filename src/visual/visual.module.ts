import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VisualService } from './visual.service';
import { VisualController } from './visual.controller';
import { VisualSchema } from './visual.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
import { ParameterModule } from '../parameter/parameter.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Visual', schema: VisualSchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
    ParameterModule],
  providers: [VisualService],
  exports: [VisualService],
  controllers: [VisualController],
})
export class VisualModule { }
