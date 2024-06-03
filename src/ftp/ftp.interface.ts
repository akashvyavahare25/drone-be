import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Ftp = Readonly<{
  host: String;
  username: String;
  password: String;
  ftpLocation: String;
  filenameRX: String;

}> &
  Document;

export class FtpDto {
  readonly host!: string;
  readonly username!: string;
  readonly password!: string;
  readonly ftpLocation!: String;
  readonly filenameRX!: String;
}
