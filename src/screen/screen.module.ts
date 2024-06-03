import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScreenService } from './screen.service';
import { ScreenController } from './screen.controller';
import { ScreenSchema } from './screen.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
import { ParameterModule } from '../parameter/parameter.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Screen', schema: ScreenSchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
    ParameterModule],
  providers: [ScreenService],
  exports: [ScreenService],
  controllers: [ScreenController],
})
export class ScreenModule { }
