import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ParameterService } from './parameter.service';
import { ParameterController } from './parameter.controller';
import { ParameterSchema, ParameterCollectionSchema } from './parameter.schema';
import { SessionManagementModule } from '../session/session-management.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Parameter', schema: ParameterSchema }]),
  MongooseModule.forFeature([{ name: 'ParameterCollection', schema: ParameterCollectionSchema }]),SessionManagementModule],
  providers: [ParameterService],
  exports: [ParameterService],
  controllers: [ParameterController],
})
export class ParameterModule { }
