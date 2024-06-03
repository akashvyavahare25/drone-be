import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DbConfigService } from './db-config.service';
import { DbConfigController } from './db-config.controller';
import { DbConfigSchema } from './db-config.schema';
import { SessionManagementModule } from '../session/session-management.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'DbConfig', schema: DbConfigSchema }]),SessionManagementModule],
  providers: [DbConfigService],
  exports: [DbConfigService],
  controllers: [DbConfigController],
})
export class DbConfigModule { }
