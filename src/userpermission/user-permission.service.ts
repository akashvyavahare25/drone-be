import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from 'src/common/exceptions';
import { UserPermissionDto, UserPermission } from './user-permission.interface';
import * as _ from 'lodash'
import { AnyAaaaRecord } from 'dns';
@Injectable()
export class UserPermissionService {

  constructor(
    @InjectModel('UserPermission') private readonly userPermissionModel: Model<UserPermission>,
  ) { }

  async create(userPermission: UserPermissionDto): Promise<UserPermission> {
    try {
      return await this.userPermissionModel.create(userPermission);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, UserPermission: UserPermissionDto): Promise<any> {
    try {
      return await this.userPermissionModel.update({ _id: id }, UserPermission);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<UserPermission> {
    try {
      const userPermission = await this.userPermissionModel.findById(id);
      if (!userPermission) {
        throw Exception();
      }
      return userPermission;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<UserPermission> {
    try {
      const userPermission = await this.userPermissionModel.findByIdAndDelete(id);
      if (!userPermission) {
        throw Exception();
      }
      return userPermission;
    } catch (e) {
      throw CustomException(e);
    }
  }
  
  async findAndDelete(id: string,type:string): Promise<any> {
    try {
      let permissions:any= await this.getAll()
      var forEachComplete = new Promise(async (resolve: any, reject: any) => {
        for (let j = 0; j < permissions.length; j++) {
         if(type==="screen"){
          const appscreenData = _.remove(permissions[j].appsPermissoin.screen, (data:any) => {
          return data._id !== id
        })
        permissions[j].appsPermissoin.screen=appscreenData
      }else if(type==="master"){
        const master=_.remove(permissions[j].master, (data:any) => {
          return data !== id
        }) 
        const masterData = _.remove(permissions[j].mastersPermissoin, (data:any) => {
          return data._id !== id
        }) 
        console.log("masterData")
        permissions[j].mastersPermissoin=masterData
        permissions[j].master=master
      } else if(type==="appMaster"){      
        const appMasterData = _.remove(permissions[j].appsPermissoin, (data:any) => {
          return data._id !== id
        }) 
        console.log("appMasterData")
        permissions[j].appsPermissoin=appMasterData
      }       
         
         
          await this.findAndUpdate(permissions[j]._id, permissions[j])
        }
      }); 
      forEachComplete.then(async () => {
        console.log(permissions)
      })
     
      return true;
    } catch (e) {
      throw CustomException(e);
    }
  }
  
  async findAndUpdate(id:string,data:any):Promise<any>{
    try{
    return await this.userPermissionModel.update({ _id: id }, data);
    }catch (e) {
      throw CustomException(e);
    }
  } 
  async getAll(): Promise<UserPermission[]> {
    try {
      return await this.userPermissionModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getPermissionByRole(user: any): Promise<any> {
    try {
      let userPermission:any
      if(!_.includes(user.roles,'superAdmin')){
        console.log(user.roles,user.appName)
       userPermission = await this.userPermissionModel.aggregate([{ $match:{role: { '$in':user.roles }}}]);
    

      }
      else{ userPermission = await this.userPermissionModel.findOne({ role: user.roles[0]});}
      return userPermission;
    } catch (e) {
      throw CustomException(e);
    }
  }
  async getPermissionForARoleAndAppName(role: string,appName:string): Promise<any> {
    try {
     
      const userPermission = await this.userPermissionModel.findOne({role: role,appName:appName });
      // console.log('userPermission userPermission', userPermission)
      // if (!userPermission) {
      //   console.log('userPermission 1 userPermission', userPermission)
      //   throw Exception();
      // }
      return userPermission;
    } catch (e) {
      throw CustomException(e);
    }
  }
  async getPermissionByRoleAndAppName(role: any,appName:any): Promise<any> {
    try {
     
      const userPermission = await this.userPermissionModel.aggregate([{ $match:{role: { '$in':role} }},{ $match:{appName:{ '$in':appName }}}]);
      // console.log('userPermission userPermission', userPermission)
      // if (!userPermission) {
      //   console.log('userPermission 1 userPermission', userPermission)
      //   throw Exception();
      // }
      return userPermission;
    } catch (e) {
      throw CustomException(e);
    }
  }
}
