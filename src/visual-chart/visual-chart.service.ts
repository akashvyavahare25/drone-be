import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception } from '../common/exceptions';
import { VisualChartDto, VisualChart } from './visual-chart.interface';
import { UserPermissionService } from 'src/userpermission/user-permission.service';

@Injectable()
export class VisualChartService {

  constructor(
    @InjectModel('VisualChart') private readonly visualChartModel: Model<VisualChart>,
    private userPermissionService:UserPermissionService
  ) { }

  async create(visualChart: VisualChartDto): Promise<VisualChart> {
    try {
      return this.visualChartModel.create(visualChart);
    } catch {
      throw Exception();
    }
  }

  async update(id: string, visualChart: VisualChartDto): Promise<any> {
    try {
      return this.visualChartModel.update({ _id: id }, visualChart);
    } catch {
      throw Exception();
    }
  }

  async findById(id: string): Promise<VisualChart> {
    const visualChart = await this.visualChartModel.findById(id);
    if (!visualChart) {
      throw Exception();
    }
    return visualChart;
  }
  async findByName(appName: string): Promise<VisualChart> {
    const visualChart = await this.visualChartModel.findOne({name:appName});
    
    return visualChart._id;
  }

  async deleteById(id: string): Promise<any> {
   const visualChart = await this.visualChartModel.findByIdAndDelete(id);
    await this.userPermissionService.findAndDelete(id,'visualChart') 
    if (!visualChart) {
      throw Exception();
    }
    return visualChart;
  }

  async getAll(): Promise<VisualChart[]> {
    try {
      return this.visualChartModel.find();
    } catch {
      throw Exception();
    }
  }

}
