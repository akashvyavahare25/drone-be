import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';
import { EmailService } from './email.service';
// import { DynaSchemaModule } from '../dynaschema/dynaschema.module';
// import { ParameterModule } from '../parameter/parameter.module';

@Module({
  imports: [
    // forwardRef(() => DynaSchemaModule),
    // ParameterModule, 
    UserModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule { }
