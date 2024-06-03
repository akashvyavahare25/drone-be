import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type LegalEntity = Readonly<{
  name: string;
 
}> &
  Document;

export class LegalEntityDto {
  readonly name!: string;
 
}

// export class AppMasterDetailsDto {
//   name!: string;
//   configuration!: any;
// }
