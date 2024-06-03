import { Document } from 'mongoose';
import * as mongoose from 'mongoose';


export type Public = Readonly<{
  name: string;
  cron_exp: string;
  type: string;
  process: mongoose.Schema.Types.Mixed;
  schema_config: mongoose.Schema.Types.Mixed;
  model_name: string;
}> &
  Document;

export class PublicDto {
  readonly name!: string;
  readonly cron_exp!: string;
  readonly type!: string;
  readonly process!: mongoose.Schema.Types.Mixed;
  schema_config!: mongoose.Schema.Types.Mixed;
  model_name!: string;

}
