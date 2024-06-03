import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from 'src/common/exceptions';
import { WfinstanceDto, Wfinstance } from './wfinstance.interface';
import { NotificationDto } from '../notification/notification.interface';

import { createUUID } from 'src/common/helpers';
import { DynaSchemaService } from 'src/dynaschema/dynaschema.service';
import { ParameterService } from 'src/parameter/parameter.service';
import { NotificationService } from 'src/notification/notification.service';
import { WorkflowService } from 'src/workflow/workflow.service';
import { EmailService } from 'src/emails/email.service';

// import { UserService } from 'src/user/user.service';
const ejs = require("ejs");

import * as _ from 'lodash'
var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   host: "smtp.hoomnture.com",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: "drone_001@hoomnture.com", // generated ethereal user
//     pass: "Drone@#htk2020", // generated ethereal password
//   },
//   tls: { secureProtocol: "TLSv1_method", rejectUnauthorized: false },
// });





@Injectable()
export class WfinstanceService {

  constructor(
    @InjectModel('Wfinstance') private readonly wfinstanceModel: Model<Wfinstance>,
    @Inject(forwardRef(() => DynaSchemaService))
    private dynaSchemaService: DynaSchemaService,
    private notificationService: NotificationService,
    private workflowService: WorkflowService,
    // private userService: UserService,
    private emailService: EmailService
  ) { }

  async create(wfinstance: WfinstanceDto): Promise<Wfinstance> {
    try {
      const wfinstanceData: any = await this.wfinstanceModel.create(wfinstance);
      return wfinstanceData;
    } catch (e) {
      throw CustomException(e);
    }
  }

  // async sendRequestMail(wfData: any, wfinstanceData: any, receiverUserId: any, ownerUserId: any, nfObject: any, nfUpdate: any, lastActionUserId: any) {
  //   const receiverUserData = await this.userService.findById(receiverUserId);
  //   const owenerUserData = await this.userService.findById(ownerUserId);
  //   const lastActionUserData = lastActionUserId && await this.userService.findById(lastActionUserId);

  //   let emailData = {
  //     ownerName: owenerUserData.firstName + ' ' + owenerUserData.lastName,
  //     receiverName: receiverUserData.firstName + ' ' + receiverUserData.lastName,
  //     wfName: wfData.name,
  //     lastActionBy: lastActionUserData ? (lastActionUserData.firstName + ' ' + lastActionUserData.lastName) : '',
  //     wfCreatedDate: wfinstanceData.createdAt,
  //     lastRemark: nfUpdate ? nfUpdate.remark : '',
  //     lastStatus: nfUpdate ? nfUpdate.actionStatus : '',
  //     actionUrl: `http://50.16.16.62/notification/action/${nfObject.targetObject}/${nfObject.wfRunObject}/${nfObject.wfInstanceId}/${nfObject._id}`
  //   }

  //   await ejs.renderFile('src/emails/requestEmail.ejs', emailData, async function (err: any, data: any) {
  //     if (data) {
  //       var mailOptions = {
  //         from: 'drone_001@hoomnture.com',
  //         to: receiverUserData.email,
  //         subject: `${wfData.name} Request by ${owenerUserData.firstName} ${owenerUserData.lastName}`,
  //         html: data
  //       };
  //       await transporter.sendMail(mailOptions, (error: any, info: any) => {
  //         if (error) {
  //           console.log(error);
  //         } else {
  //           console.log('Email sent: ' + info.response);
  //         }
  //       });
  //     }
  //   });
  // }

  // async sendOwnerRequestapproveMail(wfData: any, wfinstanceData: any, status: any, approverId: any, nfUpdate: any) {
  //   const approverUserData = await this.userService.findById(approverId);
  //   const owenerUserData = await this.userService.findById(wfinstanceData.ownerUserId);

  //   let emailData = {
  //     approverName: approverUserData.firstName + ' ' + approverUserData.lastName,
  //     ownerName: owenerUserData.firstName + ' ' + owenerUserData.lastName,
  //     wfName: wfData.name,
  //     status: status,
  //     wfCreatedDate: wfinstanceData.createdAt,
  //     remark: nfUpdate.remark,
  //   }

  //   await ejs.renderFile('src/emails/ownerRequestApprove.ejs', emailData, async function (err: any, data: any) {
  //     if (data) {
  //       var mailOptions = {
  //         from: 'drone_001@hoomnture.com',
  //         to: owenerUserData.email,
  //         subject: `${owenerUserData.firstName} ${owenerUserData.lastName} | ${wfData.name} request | ${status}`,
  //         html: data
  //       };
  //       await transporter.sendMail(mailOptions, (error: any, info: any) => {
  //         if (error) {
  //           console.log(error);
  //         } else {
  //           console.log('Email sent: ' + info.response);
  //         }
  //       });
  //     }
  //   });
  // }

  async triggerWf(req: any, resData: any, wfData: any): Promise<Wfinstance> {
    try {
      const totalWorkFlowSteps = wfData.steps.length;
      let wfInstanceObj: WfinstanceDto = {
        ownerUserId: req.user._id,
        workflowId: wfData._id,
        workflowName: wfData.name,
        wfRunObject: resData._id,
        currentStep: 1,
        workflowStatus: 'Inprogress',
        targetObject: wfData.targetObject,
        targetType: wfData.targetType,
        companyId: req.user.companyName
      }
      const wfinstanceData: any = await this.wfinstanceModel.create(wfInstanceObj);
      if (wfinstanceData) {
        let notificationObj: any = {
          wfInstanceId: wfinstanceData._id,
          description: wfData.name,
          ownerUserId: req.user._id,
          receiverUserId: wfData.steps[0].approvers[0],
          readStatus: false,
          actionStatus: 'none',
          targetObject: wfData.targetObject,
          targetType: wfData.targetType,
          wfRunObject: resData._id,
          progress: 0 + '/' + totalWorkFlowSteps,
          remark: null,
          delegateType: null,
          lastDelegateType: null,
          initiatedAt: wfinstanceData.createdAt
        }
        const nfObject = await this.notificationService.create(notificationObj);
        if (wfData.steps[0].notificationType.includes('Email')) {
          this.emailService.sendRequestMail(wfData, wfinstanceData, wfData.steps[0].approvers[0], req.user._id, nfObject, null, null, req.headers.origin);
        }
      }
      return wfinstanceData;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async statusUpdate1(req: any) {
    // console.log(req.body, 'req req req req', req)
  }

  async statusUpdate(status: string, ntObj: any, req: any): Promise<any> {
    try {
      const nfUpdate: any = await this.notificationService.update(ntObj._id, ntObj);
      const wfinstanceData: any = await this.findById(ntObj.wfInstanceId);
      const wfData: any = await this.workflowService.findById(wfinstanceData.workflowId);
      const totalWorkFlowSteps = wfData.steps.length;
      const lastStep = wfinstanceData.currentStep;
      const currentStep = (lastStep + 1);
      let receiverUserId = null;
      let progress = null;
      this.emailService.sendOwnerRequestapproveMail(wfData, wfinstanceData, status, req.user._id, nfUpdate);
      if (status == 'Delegated') {
        receiverUserId = nfUpdate.delegateUserId;
        progress = (lastStep - 1) + '/' + totalWorkFlowSteps;
      } else if (nfUpdate.lastDelegateType == 'Only Review/Ask a question?') {
        progress = (lastStep - 1) + '/' + totalWorkFlowSteps,
          receiverUserId = wfData.steps[lastStep - 1].approvers[0]
      } else if ((wfinstanceData && totalWorkFlowSteps == lastStep) || status == 'Rejected') {
        progress = lastStep + '/' + totalWorkFlowSteps;
        receiverUserId = wfinstanceData.ownerUserId;
      } else if (wfinstanceData && totalWorkFlowSteps > lastStep) {
        progress = lastStep + '/' + totalWorkFlowSteps;
        receiverUserId = wfData.steps[lastStep].approvers[0];
      }

      if (wfinstanceData && totalWorkFlowSteps >= lastStep) {
        let notificationObj: any = {
          wfInstanceId: wfinstanceData._id,
          description: wfData.name,
          ownerUserId: wfinstanceData.ownerUserId,
          receiverUserId: receiverUserId,
          readStatus: false,
          actionStatus: 'none',
          targetObject: wfData.targetObject,
          targetType: wfData.targetType,
          wfRunObject: wfinstanceData.wfRunObject,
          progress: progress,
          lastActionBy: req.user._id,
          lastActionOn: nfUpdate.updatedAt,
          lastActionStatus: nfUpdate.actionStatus,
          lastDelegateType: nfUpdate.delegateType,
          remark: null,
          delegateType: null,
          initiatedAt: wfinstanceData.createdAt
        }
        const nfObject = await this.notificationService.create(notificationObj);
        if (wfData.steps[0].notificationType.includes('Email')) {
          this.emailService.sendRequestMail(wfData, wfinstanceData, receiverUserId, wfinstanceData.ownerUserId, nfObject, nfUpdate, req.user._id, req.headers.origin);
        }
      }
      if (status != 'Delegated' && nfUpdate.lastDelegateType != 'Only Review/Ask a question?') {
        if (wfinstanceData && wfData && status == 'Approved') {
          if (totalWorkFlowSteps < currentStep) {
            this.dynaSchemaService.updateMasterDetailsStatus(wfinstanceData.targetObject, wfinstanceData.wfRunObject, 'Published')
            wfinstanceData['workflowStatus'] = 'Finished';
          } else {
            wfinstanceData['currentStep'] = currentStep;
          }
        } else {
          this.dynaSchemaService.updateMasterDetailsStatus(wfinstanceData.targetObject, wfinstanceData.wfRunObject, 'Rejected')
          wfinstanceData['workflowStatus'] = 'Rejected';
        }
        const wfinstanceDatas: any = await this.wfinstanceModel.update({ _id: ntObj.wfInstanceId }, wfinstanceData);
        return wfinstanceDatas;
      }
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Wfinstance> {
    try {
      const wfinstance = await this.wfinstanceModel.findById(id);
      if (!wfinstance) {
        throw Exception();
      }
      return wfinstance;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Wfinstance> {
    try {
      const wfinstance: any = await this.wfinstanceModel.findByIdAndDelete(id);
      if (!wfinstance) {
        throw Exception();
      }
      return wfinstance;

    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(user: any): Promise<Wfinstance[]> {
    try {
      if (_.includes(user.roles, 'superAdmin')) {
        return await this.wfinstanceModel.aggregate([
          { $sort: { updatedAt: -1 } },
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
              from: "notifications",
              localField: "_id",
              foreignField: "wfInstanceId",
              as: "historyOfWfinstance"
            }
          }

        ]);
      } else {
        return await this.wfinstanceModel.aggregate([
          { $sort: { updatedAt: -1 } },
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
              from: "notifications",
              localField: "_id",
              foreignField: "wfInstanceId",
              as: "historyOfWfinstance"
            }
          },
          {companyId:user.companyName}
        ]);
      }
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAllInprogrssWfinstance(): Promise<Wfinstance[]> {
    try {
      return await this.wfinstanceModel.aggregate([
        { $match: { workflowStatus: "Inprogress" } },
        { $sort: { updatedAt: -1 } },
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
            from: "notifications",
            localField: "_id",
            foreignField: "wfInstanceId",
            as: "historyOfWfinstance"
          }
        }
      ]);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAllInprogrssWfinstance1(): Promise<Wfinstance[]> {
    try {
      return await this.wfinstanceModel.aggregate([
        { $match: { workflowStatus: "Inprogress" } },
        {
          $lookup:
          {
            from: "notifications",
            localField: "_id",
            foreignField: "wfInstanceId",
            as: "historyOfWfinstance"
          }
        },
        { $unwind: "$historyOfWfinstance" },
        {
          $lookup:
          {
            from: "users",
            localField: "historyOfWfinstance.ownerUserId",
            foreignField: "_id",
            as: "historyOfWfinstance.ownerUser"
          }
        },
        {
          $lookup:
          {
            from: "users",
            localField: "historyOfWfinstance.receiverUserId",
            foreignField: "_id",
            as: "historyOfWfinstance.receiverUser"
          }
        },
        {
          $lookup:
          {
            from: "users",
            localField: "historyOfWfinstance.lastActionBy",
            foreignField: "_id",
            as: "historyOfWfinstance.lastActionUser"
          }
        }
      ]);
    } catch (e) {
      console.log('e e e e e e ', e)
      throw CustomException(e);
    }
  }

  async findByCodeAndId(wfinstanceCode: string, id: String): Promise<Wfinstance> {
    try {
      const wfinstance = await this.wfinstanceModel.findOne({ code: wfinstanceCode, _id: id });
      if (!wfinstance) {
        throw Exception();
      }
      return wfinstance;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByCode(wfinstanceCode: string): Promise<Wfinstance> {
    try {
      const wfinstance = await this.wfinstanceModel.findOne({ code: wfinstanceCode });
      if (!wfinstance) {
        throw Exception();
      }
      return wfinstance;
    } catch (e) {
      throw CustomException(e);
    }
  }

}
