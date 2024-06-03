import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type Notification = Readonly<{
  wfInstanceId: string;
  description: string;
  ownerUserId: string;
  receiverUserId: string;
  readStatus: boolean;
  actionStatus: string;
  // typeOfNotification: string;
  targetObject: string;
  wfRunObject: string;
  progress: string,
  lastActionBy: string,
  lastActionOn: string,
  initiatedAt: string,
  lastActionStatus: string,
  targetType: string;
  remark: string;
  delegateUserId: string;
  delegateType: string;
  lastDelegateType: string;
  files: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class NotificationDto {
  readonly wfInstanceId!: string;
  readonly description!: string;
  readonly ownerUserId!: string;
  readonly receiverUserId!: string;
  readonly readStatus!: boolean;
  readonly actionStatus!: string;
  // readonly typeOfNotification!: string;
  readonly targetObject!: string;
  readonly wfRunObject!: string;
  readonly progress!: string;
  readonly lastActionBy!: string;
  readonly lastActionOn!: string;
  readonly initiatedAt!: string;
  readonly lastActionStatus!: string;
  readonly targetType!: string;
  readonly remark!: string;
  readonly delegateUserId!: string;
  readonly delegateType!: string;
  readonly lastDelegateType!: string;
  readonly files!: mongoose.Schema.Types.Mixed;
}

