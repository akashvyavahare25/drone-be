import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type Customer = Readonly<{
  name: string;
 // appName: string;
  logo:  mongoose.Schema.Types.Mixed;
  tagLine: string;
  welcomeMessage: string;
  entityName: string;
}> &
  Document;

export class CustomerDto {
  readonly name!: string;
  //readonly appName!: string;
  readonly logo!:  mongoose.Schema.Types.Mixed;
  readonly tagLine!: string;
  readonly welcomeMessage!: string;
  readonly entityName!: string;
}
