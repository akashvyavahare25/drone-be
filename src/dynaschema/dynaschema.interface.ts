import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import {

  IsNotEmpty

} from 'class-validator';



export type TDynaSchema = Readonly<{
  model_name: string;
  form_config: mongoose.Schema.Types.Mixed;
  schema_config: mongoose.Schema.Types.Mixed;
  uniqueKey: string[];
  uniqueConfig:mongoose.Schema.Types.Mixed;
}> &
  Document;


export class DynaSchemaDto {
  @IsNotEmpty()
  modelName!: string;

  @IsNotEmpty()
  formConfig: any;

  @IsNotEmpty()
  uniqueKey: any;
}


