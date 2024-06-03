import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Dashboard, DashboardDto } from './dashboard.interface';
import { Exception, CustomException } from '../common/exceptions';

@Injectable()
export class DashboardService {
 

  constructor(
    @InjectModel('Dashboard') private readonly dashboardModel: Model<Dashboard>,
  ) { }

  /**
   * @throws duplicate key error when
   */
  async getMenuData():Promise<Dashboard[]> {
    try {
      return await this.dashboardModel.find({}).select('_id name appName');;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async create(dashboard: DashboardDto): Promise<any> {
    try {
      let data: any = await this.dashboardModel.create(dashboard);
      return data
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, dashboard: DashboardDto): Promise<any> {
    try {
      return await this.dashboardModel.update({ _id: id }, dashboard);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Dashboard[]> {
    try {
      return await this.dashboardModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Dashboard> {
    try {
      const dashboard = await this.dashboardModel.findById(id);
      if (!dashboard) {
        throw Exception();
      }
      return dashboard;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Dashboard> {
    try {
      const dashboard = await this.dashboardModel.findByIdAndDelete(id);
      if (!dashboard) {
        throw Exception();
      }
      return dashboard;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByScreenCode(targetObject: string): Promise<any> {
    try {
      return await this.dashboardModel.findOne({ targetObject: targetObject });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByScreenCodeAndTriggerName(targetObject: string, triggerOn: any): Promise<any> {
    try {
      return await this.dashboardModel.findOne({ targetObject: targetObject, triggerOn: triggerOn });
    } catch (e) {
      throw CustomException(e);
    }
  }

}
