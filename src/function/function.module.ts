import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FunctionService } from './function.service';
import { FunctionController } from './function.controller';
import { FunctionSchema } from './function.schema';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Function', schema: FunctionSchema }])],
  providers: [FunctionService],
  exports: [FunctionService],
  controllers: [FunctionController],
})
export class FunctionModule { }
