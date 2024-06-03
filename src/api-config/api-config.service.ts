import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception } from '../common/exceptions';
import { ApiConfig } from './api-config.interface';

@Injectable()
export class ApiConfigService {
 

  constructor(
    @InjectModel('ApiConfig') private readonly appMasterModel: Model<ApiConfig>,
  ) { }

 async apiFind(screen: string): Promise<any>  {
   return await this.appMasterModel.findOne({screen :screen});
  }
  
 async create(body: any): Promise<ApiConfig> {
    try {
        return await this.appMasterModel.create(body);
    } catch (error) {
        throw Exception();
    }
}


  async update(id: string, DbConfig: ApiConfig): Promise<any> {
    try {
      return await this.appMasterModel.updateOne({ _id: id }, DbConfig);
    } catch {
      throw Exception();
    }
  }

  async findById(id: string): Promise<ApiConfig> {
    const appMaster = await this.appMasterModel.findById(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async deleteById(id: string): Promise<ApiConfig> {
    const appMaster = await this.appMasterModel.findByIdAndDelete(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async getAll(): Promise<ApiConfig[]> {
    try {
      return await this.appMasterModel.find();
    } catch {
      throw Exception();
    }
  }
  

}
