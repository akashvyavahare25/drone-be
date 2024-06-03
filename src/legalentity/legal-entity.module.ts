import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LegalEntityService } from './legal-entity.service';
import { LegalEntityController } from './legal-entity.controller';
import { LegalEntitySchema } from './legal-entity.schema';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'LegalEntity', schema: LegalEntitySchema }]),SessionManagementModule],
  providers: [LegalEntityService],
  exports: [LegalEntityService],
  controllers: [LegalEntityController],
})
export class LegalEntityModule { }
