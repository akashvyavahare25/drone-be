import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionManagementModule } from '../session/session-management.module';
import { ThemeSchema } from './theme.schema';
import { ThemeController } from './theme.controller';
import { ThemeService } from './theme.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'theme', schema: ThemeSchema }]),SessionManagementModule],
  providers: [ThemeService],
  exports: [ThemeService],
  controllers: [ThemeController],
})
export class ThemeModule { }
