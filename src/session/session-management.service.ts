import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception } from '../common/exceptions';
import { SessionManagementDto, SessionManagement } from './session-management.interface';
import moment = require('moment');

@Injectable()
export class SessionManagementService {

  constructor(
    @InjectModel('SessionManagement') private readonly appMasterModel: Model<SessionManagement>,
  ) { }

  async create(appMaster: any): Promise<SessionManagement> {
    try {
      return this.appMasterModel.create(appMaster);
    } catch {
      throw Exception();
    }
  }

  async update(id: string, SessionManagement: SessionManagementDto): Promise<any> {
    try {
      return this.appMasterModel.update({ _id: id }, SessionManagement);
    } catch {
      throw Exception();
    }
  }

  async findById(id: string): Promise<Boolean> {
   
    let appMaster:any = await this.appMasterModel.findOne({userId:id});
    if (!appMaster) {
      let obj={
        userId:id
      }
     await this.create(obj)
     return true
    }else{
      console.log(new Date(),moment(appMaster.updatedAt).diff(moment(new Date(),'HH.mm')),appMaster.updatedAt,appMaster.createdAt)
      if(moment(new Date()).diff(moment(appMaster.updatedAt,'HH.mm'))>2700000){
       return false
       // return {message:"session Expired"}
      }else{
        await this.appMasterModel.updateOne({ _id: appMaster.id }, appMaster);
        return true;
      }
    }
    
    

  }
  async findByIdAndUpdate(id: string): Promise<Boolean> {
   
    let appMaster:any = await this.appMasterModel.findOne({userId:id});
    if (!appMaster) {
      let obj={
        userId:id
      }
     await this.create(obj)
     return true
    }else{     
        await this.appMasterModel.update({ _id: appMaster.id }, appMaster);
        return true;
      
    }
    
    

  }
  async deleteById(id: string): Promise<SessionManagement> {


    const appMaster = await this.appMasterModel.findByIdAndDelete(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }
  
  async findByAppId(id): Promise<SessionManagement[]> {
    try {
      return this.appMasterModel.find({appName:id});
    } catch {
      throw Exception();
    }
  }

  async getAll(): Promise<SessionManagement[]> {
    try {
      return this.appMasterModel.find();
    } catch {
      throw Exception();
    }
  }

}
