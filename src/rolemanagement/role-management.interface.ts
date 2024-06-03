import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type RoleManagement = Readonly<{
  name: string;
 // status: string;
 appName: string;
}> &
  Document;

export class RoleManagementDto {
  readonly name!: string;
  //readonly status!: string;
  readonly appName!: string;
}

// export class AppMasterDetailsDto {
//   name!: string;
//   configuration!: any;
// }
