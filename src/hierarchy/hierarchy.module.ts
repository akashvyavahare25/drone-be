import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HierarchyService } from './hierarchy.service';
import { HierarchyController } from './hierarchy.controller';
import { HierarchySchema } from './hierarchy.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
import { ParameterModule } from '../parameter/parameter.module';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Hierarchy', schema: HierarchySchema }]),SessionManagementModule,
  forwardRef(() => DynaSchemaModule),
    ParameterModule],
  providers: [HierarchyService],
  exports: [HierarchyService],
  controllers: [HierarchyController],
})
export class HierarchyModule { }
