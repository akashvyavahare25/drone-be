import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionManagementModule } from '../session/session-management.module';
import { ApiConfigController } from './api-config.controller';
import { ApiConfigSchema } from './api-config.schema';
import { ApiConfigService } from './api-config.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ApiConfig', schema: ApiConfigSchema }]),SessionManagementModule],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
  controllers: [ApiConfigController],
})
export class ApiConfigModule { }
