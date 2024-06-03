import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type AppMaster = Readonly<{
  name: string;
  status: string;
  description: string;
}> &
  Document;

export class AppMasterDto {
  readonly name!: string;
  readonly status!: string;
  readonly description!: string;
}

// export class AppMasterDetailsDto {
//   name!: string;
//   configuration!: any;
// }
