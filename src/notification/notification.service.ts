import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from '../common/exceptions';
import { NotificationDto, Notification } from './notification.interface';
import { createUUID } from '../common/helpers';
import { DynaSchemaService } from '../dynaschema/dynaschema.service';
import { ParameterService } from '../parameter/parameter.service';
import * as _ from 'lodash'


@Injectable()
export class NotificationService {

  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
    @Inject(forwardRef(() => DynaSchemaService))
    private dynaSchemaService: DynaSchemaService,
    private parameterService: ParameterService
  ) { }

  async create(notification: NotificationDto): Promise<Notification> {
    try {
      const notificationData: any = await this.notificationModel.create(notification);
      return notificationData;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, notification: NotificationDto): Promise<any> {
    try {
      const notificationData: any = await this.notificationModel.findOneAndUpdate({ _id: id }, notification, { new: true });
      return notificationData
    } catch (e) {
      throw CustomException(e);
    }
  }

  async updateFinishRejectStatus(notificationId: string): Promise<any> {
    try {
      const notificationData: any = await this.notificationModel.update({ _id: notificationId }, { $set: { 'actionStatus': 'Ok' } });
      return notificationData
    } catch (e) {
      throw CustomException(e);
    }
  }



  async findById(id: string): Promise<Notification> {
    try {
      const notification = await this.notificationModel.findById(id);
      if (!notification) {
        throw Exception();
      }
      return notification;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Notification> {
    try {
      const notification: any = await this.notificationModel.findByIdAndDelete(id);
      return notification;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Notification[]> {
    try {
      return await this.notificationModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async noActionGetAllNotification(user: any): Promise<Notification[]> {
    try {
      // return await this.notificationModel.find({ actionStatus: 'none' }).populate("User");
      return await this.notificationModel.aggregate([
        { $match: { actionStatus: "none", receiverUserId: user._id } },
        {
          $lookup:
          {
            from: "users",
            localField: "ownerUserId",
            foreignField: "_id",
            as: "ownerUser"
          }
        },
        {
          $lookup:
          {
            from: "users",
            localField: "receiverUserId",
            foreignField: "_id",
            as: "receiverUser"
          }
        },
        {
          $lookup:
          {
            from: "users",
            localField: "lastActionBy",
            foreignField: "_id",
            as: "lastActionUser"
          }
        }
      ])
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getHistoryOfWfinstance(wfinstanceId: string): Promise<Notification[]> {
    try {
      // return await this.notificationModel.find({ actionStatus: 'none' }).populate("User");
      return await this.notificationModel.aggregate([
        { $match: { wfInstanceId: mongoose.Types.ObjectId(wfinstanceId) } },
        {
          $lookup:
          {
            from: "users",
            localField: "ownerUserId",
            foreignField: "_id",
            as: "ownerUser"
          }
        },
        {
          $lookup:
          {
            from: "users",
            localField: "receiverUserId",
            foreignField: "_id",
            as: "receiverUser"
          }
        },
        {
          $lookup:
          {
            from: "users",
            localField: "lastActionBy",
            foreignField: "_id",
            as: "lastActionUser"
          }
        }
      ])
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getHistoryOfWfinstanceWithCheckOfSameUserNf(wfinstanceId: string, nfId: string, user: any): Promise<any> {
    try {
      // return await this.notificationModel.find({ actionStatus: 'none' }).populate("User");
      const nfData: any = await this.notificationModel.findById(nfId);
      if (nfData.actionStatus == 'none' && JSON.stringify(nfData.receiverUserId) === JSON.stringify(user._id)) {
        let historyData: any = await this.notificationModel.aggregate([
          { $match: { wfInstanceId: mongoose.Types.ObjectId(wfinstanceId) } },
          {
            $lookup:
            {
              from: "users",
              localField: "ownerUserId",
              foreignField: "_id",
              as: "ownerUser"
            }
          },
          {
            $lookup:
            {
              from: "users",
              localField: "receiverUserId",
              foreignField: "_id",
              as: "receiverUser"
            }
          },
          {
            $lookup:
            {
              from: "users",
              localField: "lastActionBy",
              foreignField: "_id",
              as: "lastActionUser"
            }
          }
        ]);
        historyData['code'] = 200;
        return historyData;
      } else if (nfData.actionStatus != 'none') {
        return { code: 403, message: 'You have already performed action on this notification.' }
      } else if (nfData.receiverUserId != user._id) {
        return { code: 403, message: 'This link is unathorized for you.' }
      }
    } catch (e) {
      throw CustomException(e);
    }
  }



  async findByCodeAndId(notificationCode: string, id: String): Promise<Notification> {
    try {
      const notification = await this.notificationModel.findOne({ code: notificationCode, _id: id });
      if (!notification) {
        throw Exception();
      }
      return notification;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByCode(notificationCode: string): Promise<Notification> {
    try {
      const notification = await this.notificationModel.findOne({ code: notificationCode });
      if (!notification) {
        throw Exception();
      }
      return notification;
    } catch (e) {
      throw CustomException(e);
    }
  }

}
