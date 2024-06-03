import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from 'src/common/exceptions';
import { VisualDto, Visual } from './visual.interface';

@Injectable()
export class VisualService {
 
  constructor(
    @InjectModel('Visual') private readonly visualModel: Model<Visual>) { }

  async create(visual: VisualDto): Promise<Visual> {
    try {
      return await this.visualModel.create(visual);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, Visual: VisualDto): Promise<any> {
    try {
      return await this.visualModel.update({ _id: id }, Visual);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Visual> {
    try {
      const visual = await this.visualModel.findById(id);
      if (!visual) {
        throw Exception();
      }
      return visual;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Visual> {
    try {
      const visual = await this.visualModel.findByIdAndDelete(id);
      if (!visual) {
        throw Exception();
      }
      return visual;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Visual[]> {
    try {
      return await this.visualModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

}
