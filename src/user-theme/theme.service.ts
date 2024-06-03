import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception } from '../common/exceptions'; 
import { Theme } from './theme.interface';

@Injectable()
export class ThemeService {
  constructor(
    @InjectModel('theme') private readonly appMasterModel: Model<Theme>,
  ) { }

  async create(appMaster: any): Promise<any> {
    try {
      let body :any = appMaster.body
      body['employeeId'] = appMaster.user['_id']
      body['companyName'] = appMaster.user['_id']
      console.log("aaaaaaaaaaaaaaaa",body)
      const themeData = await this.appMasterModel.find({employeeId:body.employeeId});
      if(themeData.length > 0){
        if(themeData[0].employeeId == body.employeeId){
          try {
           return this.appMasterModel.update({ _id: themeData[0]._id }, body);
          } catch {
            throw Exception();
          }
        }
      }
      else{
        return this.appMasterModel.create(body);
      }
    } catch {
      throw Exception();
    }
  }

  async update(id: string, LegalEntity: any): Promise<any> {
    try {
      return this.appMasterModel.update({ _id: id }, LegalEntity);
    } catch {
      throw Exception();
    }
  }

  async findById(employeeId: string): Promise<any> {
    const appMaster = await this.appMasterModel.find({employeeId:employeeId});
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async deleteById(id: string): Promise<any> {
    const appMaster = await this.appMasterModel.findByIdAndDelete(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async getAll(): Promise<any[]> {
    try {
      return this.appMasterModel.find();
    } catch {
      throw Exception();
    }
  }

}
