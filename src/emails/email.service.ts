import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as _ from 'lodash'
const ejs = require("ejs");
import { UserService } from '../user/user.service';
const CsvParser = require("json2csv").Parser;
import {
  UserNotFoundException,
  EmailAlreadyUsedException,
  PasswordResetTokenInvalidException,
  ActivationTokenInvalidException,
  CustomException,
} from '../common/exceptions';
import moment = require('moment');
var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: "smtp.hoomnture.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "drone_001@hoomnture.com", // generated ethereal user
    pass: "Drone@#htk2020", // generated ethereal password
  },
  tls: { secureProtocol: "TLSv1_method", rejectUnauthorized: false },
});



@Injectable()
export class EmailService {

  constructor(
    private userService: UserService,
  ) { }


  async sendRequestMail(wfData: any, wfinstanceData: any, receiverUserId: any, ownerUserId: any, nfObject: any, nfUpdate: any, lastActionUserId: any, originUrl: any) {
    const receiverUserData = await this.userService.findById(receiverUserId);
    const owenerUserData = await this.userService.findById(ownerUserId);
    const lastActionUserData = lastActionUserId && await this.userService.findById(lastActionUserId);

    let emailData = {
      ownerName: owenerUserData.firstName + ' ' + owenerUserData.lastName,
      receiverName: receiverUserData.firstName + ' ' + receiverUserData.lastName,
      wfName: wfData.name,
      lastActionBy: lastActionUserData ? (lastActionUserData.firstName + ' ' + lastActionUserData.lastName) : '',
      wfCreatedDate: wfinstanceData.createdAt,
      lastRemark: nfUpdate ? nfUpdate.remark : '',
      lastStatus: nfUpdate ? nfUpdate.actionStatus : '',
      actionUrl: `${originUrl}/notification/action/${nfObject.targetObject}/${nfObject.wfRunObject}/${nfObject.wfInstanceId}/${nfObject._id}`
    }

    await ejs.renderFile('src/emails/requestEmail.ejs', emailData, async function (err: any, data: any) {
      if (data) {
        var mailOptions = {
          from: 'drone_001@hoomnture.com',
          to: receiverUserData.email,
          subject: `${wfData.name} Request by ${owenerUserData.firstName} ${owenerUserData.lastName}`,
          html: data
        };
        await transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    });
  }
async resetPassword(email:any,password:any){
 let user= await this.userService.resetPassword(email,password)
 const data={
  user:user.firstName+" "+user.lastName,
  email:user.email
}
 await ejs.renderFile('src/emails/resetpassword.ejs',data, async function (err: any, data: any) {
   if (data) {
     var mailOptions = {
       from: 'drone_001@hoomnture.com',
       to: email,
       subject: "Your password has been changed",
       html: data
     };
     await transporter.sendMail(mailOptions, (error: any, info: any) => {
       if (error) {
         console.log(error);
       } else {
         console.log('Email sent: ' + info.response);
       }
     });
   }
 });

}
  async forgottenPassword(email: string, origin: string) {
    try {
     const  user =await this.userService.findByEmail(email.toLowerCase())
      if (!user) {
        throw UserNotFoundException();
      }
     const data={
       email:user.email,
       id:user.id
     }
      let  token=jwt.sign(data, `${user.id}`,{ expiresIn: '1d' })
      var decoded = jwt.decode(token, {complete: true});
      jwt.verify(token, `${user.id}`, function(err, decoded) {
        if (err) {
         return err.name
        }else{
          return decoded;
        }
      });
      
     await this.sendForgotPasswordLink(
        user.email,
       token,
        origin,
      );
    } catch (e) {
      throw CustomException(e);
    }
  }
  async sendForgotPasswordLink(email: any, token,origin) {
   const data={
     email:email,
     token:token,
     origin:origin,
     actionUrl: `${origin}/auth/reset-password/${token}`
   }
    await ejs.renderFile('src/emails/forgotpassword.ejs',data, async function (err: any, data: any) {
      if (data) {
        var mailOptions = {
          from: 'drone_001@hoomnture.com',
          to: email,
          subject: "Reset your password",
          html: data
        };
        await transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    });
  }

  async sendOwnerRequestapproveMail(wfData: any, wfinstanceData: any, status: any, approverId: any, nfUpdate: any) {
    const approverUserData = await this.userService.findById(approverId);
    const owenerUserData = await this.userService.findById(wfinstanceData.ownerUserId);

    let emailData = {
      approverName: approverUserData.firstName + ' ' + approverUserData.lastName,
      ownerName: owenerUserData.firstName + ' ' + owenerUserData.lastName,
      wfName: wfData.name,
      status: status,
      wfCreatedDate: wfinstanceData.createdAt,
      remark: nfUpdate.remark,
    }

    await ejs.renderFile('src/emails/ownerRequestApprove.ejs', emailData, async function (err: any, data: any) {
      if (data) {
        var mailOptions = {
          from: 'drone_001@hoomnture.com',
          to: owenerUserData.email,
          subject: `${owenerUserData.firstName} ${owenerUserData.lastName} | ${wfData.name} request | ${status}`,
          html: data
        };
        await transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    });
  }

  async sendFileUploadMail(fileOrignalName: any, reportData: any, senderUser: any) {
    // console.log(reportData, 'reportData senderUser', senderUser)
    let emailData = {
      name: senderUser.firstName + ' ' + senderUser.lastName,
      totalRecord: reportData.successCount + reportData.failureCount + reportData.ignoreCount,
      success: reportData.successCount,
      failed: reportData.failureCount,
      ignore: reportData.ignoreCount,
      fileName: fileOrignalName
    }

    await ejs.renderFile('src/emails/fileUploadEmail.ejs', emailData, async function (err: any, data: any) {
      if (data) {
        let attachments = [];
        // let attachments = [{
        //   filename: fileOrignalName + '_report.txt',
        //   content: 'File uploaded Successfully with '
        //     + reportData.successCount +
        //     ' Success, ' + reportData.ignoreCount +
        //     ' Ignore and ' + reportData.failureCount + ' Failure ' +
        //     JSON.stringify(reportData.failureRecords)
        // }];
        if (reportData.ignoreCount > 0) {
          const csvParser = new CsvParser(Object.keys(reportData.ignoreRecords));
          const csvData = csvParser.parse(reportData.ignoreRecords);
          attachments.push({
            filename: fileOrignalName.split(".")[0] + '_ignore.csv',
            content: csvData
          });
        }
        if (reportData.failureCount > 0) {
          const csvParser = new CsvParser(Object.keys(reportData.failureRecords));
          const csvData = csvParser.parse(reportData.failureRecords);
          attachments.push({
            filename: fileOrignalName.split(".")[0] + '_failure.csv',
            content: csvData
          });
        }
        var mailOptions = {
          from: 'drone_001@hoomnture.com',
          to: senderUser.email,
          // to: 'mindnerves10024@gmail.com',
          subject: 'File Uploaded Report',
          html: data,
          attachments: attachments,
        };
        await transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    });
  }


}