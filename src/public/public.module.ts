import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MasterModule } from 'src/master/master.module';
import { ScreenModule } from 'src/screen/screen.module';
import { ReportModule } from 'src/report/report.module';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { PublicSchema } from './public.schema';
import { ApiinterfaceModule } from '../apiinterface/apiinterface.module';
import { DynaSchemaModule } from '../dynaschema/dynaschema.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Public', schema: PublicSchema }]),
  forwardRef(() => MasterModule),
  forwardRef(() => ScreenModule),
  forwardRef(() => ReportModule),
  forwardRef(() => DynaSchemaModule),
  forwardRef(() => ApiinterfaceModule)],
  providers: [PublicService],
  exports: [PublicService],
  controllers: [PublicController],
})
export class PublicModule { }
