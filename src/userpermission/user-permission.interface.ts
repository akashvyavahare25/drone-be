import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type UserPermission = Readonly<{
  role: string;
  configPermission: mongoose.Schema.Types.Mixed;
  appName:string
  master: mongoose.Schema.Types.Mixed;
  appsPermissoin: mongoose.Schema.Types.Mixed;
  mastersPermissoin: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class UserPermissionDto {
  readonly role!: string;
  readonly appName!:string
  readonly configPermission!: mongoose.Schema.Types.Mixed;
 readonly master!: mongoose.Schema.Types.Mixed;
  readonly appsPermissoin!: mongoose.Schema.Types.Mixed;
  readonly mastersPermissoin!: mongoose.Schema.Types.Mixed;
}

// export class UserPermissionDetailsDto {
//   name!: string;
//   configuration!: any;
// }
