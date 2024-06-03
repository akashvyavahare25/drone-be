import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type DbConfig = Readonly<{
  name: string;
  appName:string;
  screen:string;
  db:string;
  host:string;
  user:string;
  database:string;
  password:string;
  existingTable:boolean;
  companyName:string;
  tableName:string;
  port:string;
  // exsitingtableName:string;
  config: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class DbConfigDto {
  readonly name!: string;
  readonly appName!: string;
  readonly screen!: string;
  readonly db!: string;
  readonly host!: string;
  readonly user!: string;
  readonly database!:string;
  readonly password!: string;
  readonly existingTable!: boolean;
  readonly companyName!: string;
  readonly tableName!: string;
  readonly port!:string;
  // readonly exsitingtableName!:string;
  // readonly config!: mongoose.Schema.Types.Mixed;
 
}

// export class AppMasterDetailsDto {
//   name!: string;
//   configuration!: any;
// }
