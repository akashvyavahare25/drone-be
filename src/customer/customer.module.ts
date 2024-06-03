import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerSchema } from './customer.schema';
import { SessionManagementModule } from '../session/session-management.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),SessionManagementModule
  ],
  providers: [CustomerService],
  exports: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule { }
