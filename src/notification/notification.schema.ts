import * as mongoose from 'mongoose';

import { Notification } from './notification.interface';

export const NotificationSchema = new mongoose.Schema<Notification>(
  {
    wfInstanceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    receiverUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    readStatus: { type: Boolean, required: true },
    actionStatus: { type: String, required: true },
    targetObject: { type: String, required: true },
    wfRunObject: { type: String, required: true },
    progress: { type: String, required: false },
    lastActionBy: { type: mongoose.Schema.Types.ObjectId, required: false, default: null, ref: 'User' },
    lastActionOn: { type: mongoose.Schema.Types.Date, required: false, default: null },
    initiatedAt: { type: mongoose.Schema.Types.Date, required: false, default: null },
    lastActionStatus: { type: String, required: false, default: null },
    targetType: { type: String, required: true },
    remark: { type: String, required: false },
    delegateUserId: { type: mongoose.Schema.Types.ObjectId, required: false, default: null, ref: 'User' },
    delegateType: { type: String, required: false },
    lastDelegateType: { type: String, required: false },
    files: { type: mongoose.Schema.Types.Mixed, required: false },
  },
  { timestamps: true },
);
