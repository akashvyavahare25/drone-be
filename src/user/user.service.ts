import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
var fs = require('fs');
import * as mongoose from 'mongoose';
import config from '../config';
import { getOriginHeader, hashPassword } from '../common/auth';
import {
  UserNotFoundException,
  EmailAlreadyUsedException,
  PasswordResetTokenInvalidException,
  ActivationTokenInvalidException,
  CustomException,
  Exception,
} from '../common/exceptions';
var csv = require("csvtojson");
import { RoleIdCollection, User, UserDto } from './user.interface';
import { UserMailerService } from './user.mailer.service';
import { SignUpDto } from 'src/auth/auth.interface';
import { parse } from '@fast-csv/parse';
import { CustomerService } from '../customer/customer.service'
import { AppMasterService } from '../appmaster/app-master.service';
import { RoleManagement } from 'src/rolemanagement/role-management.interface';

@Injectable()
export class UserService {
  private modelMap = new Map<String, mongoose.Model<any>>();
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userMailer: UserMailerService,
    private readonly customerService: CustomerService,
    private readonly appMasterService: AppMasterService,
    @InjectModel('RoleIdCollection') private readonly roleIdCollectionModel: Model<RoleIdCollection>,
  ) { }
  /**
   * Creates user and sends activation email.
   * @throws duplicate key error when
   */
  // tslint:disable-next-line: max-line-length
  async create(email: string, password: string, roles: string[], origin: string, firstName: string, lastName: string,
    address: string, phone: string, designation: string, department: string, companyName: string, employeeId: string, masterName: string, column: string, reportingManager: string,
    appName: string): Promise<User> {
    try {
      const user = await this.userModel.create({
        firstName,
        lastName,
        address,
        email: email.toLowerCase(),
        password: await hashPassword(password),
        activationToken: uuid(),
        roles,
        phone,
        department,
        designation,
        companyName,
        employeeId,
        masterName,
        isActive: true,
        column,
        reportingManager,
        appName,
        activationExpires: Date.now() + config.auth.activationExpireInMs,
      });

      await this.userMailer.sendActivationMail(
        user.email,
        user.id,
        user.activationToken,
        origin,
      );

      if (user.roles) {
         user.roles.forEach(async role => {
          await  this.roleIdCollectionModel.create({
            userId: user._id,
            roleName: role,
          })

        })
      }
      return user;
    } catch (e) {
      throw CustomException(e);
    }
  }
  async uploadfile(files: any, req: any): Promise<any> {
    try {
      let tutorials: any = [];
      return new Promise(async (resolve, reject) => {
        fs.createReadStream(files[0].path)
          .pipe(parse({ headers: true, skipLines: 0, ignoreEmpty: true })
            .on("error", (error: any) => {
              //  console.log("error",error)
              reject(new Error(error));
              // throw error.message;
            })
            .on("data", (row: any) => {
              let dataGridCode: any = '';
              let dataGridComponents: any = '';
              let flag: any = true;


              // console.log("data",row)
              tutorials.push(row);
            }))
          .on("end", async () => {
            let obj = { name: "users", configuration: tutorials }
            //  console.log("confiiiiiiiiiiiiiiiiiiii",obj)
            await this.addUserDetails(obj, req).then((resp2: any) => {
              fs.unlinkSync(files[0].path);
              resolve(resp2);
            }).catch((error: any) => {
              reject(error);
            })
          });
      })
    } catch (e) {
      // console.log('e', e)
      throw CustomException(e);
    }
  }
  async addUserDetails(users: any, req): Promise<any> {
    let successRecord: any = [];
    let failureRecord: any = [];

    let foreachPromise = new Promise(async (resolve, reject) => {
      for (let i = 0; i <= users.configuration.length; i++) {
        try {
          let companyId: any = await this.customerService.findByName(users.configuration[i].companyName)
          let masterCode: any = await this.getMasterCodeByName(users.configuration[i].masterName)
          let appId = await this.appMasterService.findByName(users.configuration[i].appName)
          let managerId = await this.getManagerCode(users.configuration[i].reportingManager)

          console.log("reportTTTTTT", masterCode, companyId, appId, managerId)
          let rData: any = await this.create(users.configuration[i].email,
            users.configuration[i].password, users.configuration[i].roles, getOriginHeader(req), users.configuration[i].firstName, users.configuration[i].lastName,
            users.configuration[i].address, users.configuration[i].phone, users.configuration[i].designation, users.configuration[i].department, companyId, users.configuration[i].employeeId, masterCode.code, users.configuration[i].column, managerId.employeeId, appId._id);
          successRecord.push(rData);
        } catch (e) {
          const errorObj = { record: users.configuration[i], error: e }
          failureRecord.push(errorObj);
          // throw CustomException(e);
        }
        if (i == (users.configuration.length - 1)) {
          const fileReport: any = {
            successCount: successRecord.length,
            successRecords: successRecord,
            failureCount: failureRecord.length,
            failureRecords: failureRecord
          }
          return resolve(fileReport);
        }
      }
    })
    return await foreachPromise;
  }
  async getMasterCodeByName(masterName: string): Promise<any> {
    const model = await this.getModel('Master');
    console.log("hiiiiiiiiiiiiiiiiiii", model)

    try {
      return model.findOne({ 'name': masterName }).select('code -_id');

    } catch (e) {
      throw CustomException(e);
    }

  }
  async getManagerCode(masterName: string): Promise<any> {
    const model = await this.getModel('M_EMPLOYEE MASTER_iRNpzI');
    console.log("hiiiiiiiiiiiiiiiiiii", model)

    try {
      return model.findOne({ 'fullName': masterName }).select('employeeId -_id');

    } catch (e) {
      throw CustomException(e);
    }

  }
  async getModel(modelName: string): Promise<mongoose.Model<any> | undefined> {
    try {
      const model: mongoose.Model<any> = await this.connection.model(modelName);
      //const  model= mongoose.connection.models['S_CONTRACT_2_Vf2e7k'];
      //  console.log("hhhhhh",await this.connection.model('S_CONTRACT_2_Vf2e7k'),model)

      if (model) {
        return model;
      } else {
        throw Exception;
      }
    } catch (e) {
      throw CustomException(e);
    }
  }
  async findById(id: string): Promise<any> {
    try {
      const user = await this.userModel.findById(id).select('firstName _id lastName email phone address roles designation department companyName masterName employeeId appName column reportingManager');
      if (!user) {
        throw UserNotFoundException();
      }
      return user;
    } catch (e) {
      throw CustomException(e);
    }

  }

  async findByRole(roles: string[]): Promise<any> {
    try {
      const users = await this.userModel.find({ roles: { $in: roles } }).select('firstName _id lastName email phone address roles designation department');
      if (!users) {
        throw UserNotFoundException();
      }
      return users;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findRoleIdUser(roleName): Promise<RoleIdCollection[]> {
    try {
      return await this.roleIdCollectionModel.find({roleName :roleName}); 
    } catch (e) {
      throw CustomException(e);
    }
  }

  async resetPassword(email, password) {
    try {
      let user = await this.userModel
        .findOneAndUpdate(
          {
            email: email,
          },
          {
            password: await hashPassword(password),
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();


      if (!user) {
        throw new ConflictException();
      }

      return user;
    } catch (e) {
      throw CustomException(e);
    }

  }
  async updateUser(id: string, userData: any): Promise<User> {

    try {
      let user = await this.userModel
        .findOneAndUpdate(
          {
            _id: id,
          },
          {
            firstName: userData.firstName,
            lastName: userData.lastName,
            address: userData.address,
            phone: userData.phone,
            roles: userData.roles,
            department: userData.department,
            designation: userData.designation,
            companyName: userData.companyName,
            masterName: userData.masterName,
            employeeId: userData.employeeId,
            column: userData.column,
            reportingManager: userData.reportingManager,
            appName: userData.appName
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();

      if (userData.isPasswordChange) {
        user = await this.userModel
          .findOneAndUpdate(
            {
              _id: id,
            },
            {
              password: await hashPassword(userData.password),
            },
            {
              new: true,
              runValidators: true,
            },
          )
          .exec();
      }

      if (!user) {
        throw new ConflictException();
      }

      return user;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne(
        { email: email.toLowerCase() },
        '+password',
      );
      if (!user) {
        throw UserNotFoundException();
      }

      return user;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async activate(userId: string, activationToken: string) {
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          {
            _id: userId,
            activationToken,
            isActive: false,
          },
          {
            isActive: true,
            activationToken: undefined,
            activationExpires: undefined,
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .where('activationExpires')
        .gt(Date.now())
        .exec();

      if (!user) {
        throw ActivationTokenInvalidException();
      }

      return user;
    } catch (e) {
      throw CustomException(e);
    }
  }
  async deleteById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete(id);
      if (!user) {
        throw UserNotFoundException();
      }
      return user;
    } catch (e) {
      throw CustomException(e);
    }
  }
  async deleteByUserRole(roleName: string): Promise<RoleIdCollection> {
    try {
      return await this.roleIdCollectionModel.findOneAndDelete({roleName:roleName});
    } catch (e) {
      throw CustomException(e);
    }
  }
  async findReporter(empId: string): Promise<any> {
    try {

      const user = await this.userModel.findOne({ reportingManager: empId });

      return user;
    } catch (e) {
      throw CustomException(e);
    }
  }
  /*async forgottenPassword(email: string, origin: string) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        {
          email: email.toLowerCase(),
        },
        {
          passwordResetToken: uuid(),
          passwordResetExpires: Date.now() + config.auth.activationExpireInMs,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!user) {
        throw UserNotFoundException();
      }

      this.userMailer.sendForgottenPasswordMail(
        user.email,
        user.passwordResetToken,
        origin,
      );
    } catch (e) {
      throw CustomException(e);
    }
  }*/

  // async resetPassword(
  //   email: string,
  //   passwordResetToken: string,
  //   password: string,
  // ) {
  //   try {
  //     const user = await this.userModel
  //       .findOneAndUpdate(
  //         {
  //           email: email.toLowerCase(),
  //           passwordResetToken,
  //         },
  //         {
  //           password: await hashPassword(password),
  //           passwordResetToken: undefined,
  //           passwordResetExpires: undefined,
  //         },
  //         {
  //           new: true,
  //           runValidators: true,
  //         },
  //       )
  //       .where('passwordResetExpires')
  //       .gt(Date.now())
  //       .exec();

  //     if (!user) {
  //       throw PasswordResetTokenInvalidException();
  //     }

  //     this.userMailer.sendResetPasswordMail(user.email);

  //     return user;
  //   } catch (e) {
  //     throw CustomException(e);
  //   }
  // }
}
