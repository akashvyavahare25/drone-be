import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GenericService } from './generic.service';
import { GenericController } from './generic.controller';
import { DynaSchemaSchema } from '../dynaschema/dynaschema.schema';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'DynaSchema', schema: DynaSchemaSchema }]), DynaSchemaModule],
  providers: [GenericService],
  exports: [GenericService],
  controllers: [GenericController],
})
export class GenericModule {}
