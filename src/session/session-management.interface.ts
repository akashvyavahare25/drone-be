import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type SessionManagement = Readonly<{
  userId: string;
 // status: string;
 //appName: string;
}> &
  Document;

export class SessionManagementDto {
  readonly userId!: string;
  //readonly status!: string;
  //readonly appName!: string;
}

// export class AppMasterDetailsDto {
//   name!: string;
//   configuration!: any;
// }
