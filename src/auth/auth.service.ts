import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { comparePassword } from '../common/auth';
import { UserService } from '../user/user.service';
import { User } from '../user/user.interface';
import {  LoginCredentialsException, UserNotFoundException } from '../common/exceptions';
import { UserPermissionService } from '../userpermission/user-permission.service';
import { Customer } from '../customer/customer.interface'
import { CustomerService } from '../customer/customer.service'
import {
  ActivateParams,
  ForgottenPasswordDto,
  ResetPasswordDto,
  SignUpDto,
} from './auth.interface';
import { format } from 'util';
import { EmailService } from '../emails/email.service';
import _ = require('lodash');
import { split } from 'lodash';
import { SessionManagementService } from '../session/session-management.service';
var jwt = require('jsonwebtoken');
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserPermissionService))
    private userPermissionService: UserPermissionService,
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,
    @Inject(forwardRef(() => EmailService))
    private email: EmailService,
    private sessionManagementService:SessionManagementService
  ) { }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!comparePassword(password, user.password)) {
      throw LoginCredentialsException();
    }
    return user;
  }

  async activate({ userId, activationToken }: ActivateParams) {
    const user = await this.userService.activate(userId, activationToken);
    return {
      token: this.jwtService.sign({}, { subject: `${user.id}` }),
      user: user.getPublicData(),
    };
  }

  async login(user: User) {
    return {
      token: this.jwtService.sign({}, { subject: `${user.id}` }),
      user: user.getPublicData(),
      updated:await this.sessionManagementService.findByIdAndUpdate(user._id),
      userPermission: await this.userPermissionService.getPermissionByRole(user),
      customerData: user.companyName ? await this.customerService.findById(user.companyName) : ""
    };
  }

  async signUpUser(userData: SignUpDto, origin: string) {
    const user = await this.userService.create(
      userData.email,
      userData.password,
      userData.roles,
      origin,
      userData.firstName,
      userData.lastName,
      userData.address,
      userData.phone,
      userData.designation,
      userData.department,
      userData.companyName,
      userData.employeeId,
      userData.masterName,      
      userData.column,
      userData.reportingManager,
      userData.appName

    );
    return {
      token: this.jwtService.sign({}, { subject: `${user.id}` }),
      user: user.getPublicData(),
    };
  }

  async addUser(userData: SignUpDto, origin: string) {
    const user = await this.userService.create(
      userData.email,
      userData.password,
      userData.roles,
      origin,
      userData.firstName,
      userData.lastName,
      userData.address,
      userData.phone,
      userData.designation,
      userData.department,
      userData.companyName,
      userData.employeeId,
      userData.masterName,
      userData.column,
      userData.reportingManager,
      userData.appName
    );
    return {
      user: user.getPublicData(),
    };
  }

  async forgottenPassword({ email }: ForgottenPasswordDto, origin: string) {
   try{
    const  user =await this.userService.findByEmail(email.toLowerCase())
    if (!user) {
      throw UserNotFoundException();
    }
    return await this.email.forgottenPassword(email, origin);
   } 
   catch(e){
    throw UserNotFoundException();
   }
  }

  async resetPassword(data: any) {
    let isValid = await this.verifyJwtToken(data)
    if (isValid.success) {
      return await this.email.resetPassword(data.email, data.password)
    }
    else {
      return isValid
    }

  }

  async verifyJwtToken(data: any) {
    var decoded = jwt.decode(data.token, { complete: true });
    let result: any
    jwt.verify(data.token, `${decoded.payload.id}`, function (err, decoded) {
      if (err) {
        result = { error: err.name }
      } else {
        result = { success: decoded.email };
      }
    });
    return result


  }
}
