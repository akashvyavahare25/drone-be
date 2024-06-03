import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { RulesSchema } from './rules.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
import { ParameterModule } from '../parameter/parameter.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Rules', schema: RulesSchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
    ParameterModule],
  providers: [RulesService],
  exports: [RulesService],
  controllers: [RulesController],
})
export class RulesModule { }
