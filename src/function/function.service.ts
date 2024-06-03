import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from '../common/exceptions';
import { FunctionDto, Function } from './function.interface';

@Injectable()
export class FunctionService {
  constructor(
    @InjectModel('Function') private readonly _functionModel: Model<Function>,
  ) { }

  async create(_function: FunctionDto): Promise<Function> {
    try {
      return await this._functionModel.create(_function);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, Function: FunctionDto): Promise<any> {
    try {
      return await this._functionModel.update({ _id: id }, Function);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Function> {
    try {
      const _function = await this._functionModel.findById(id);
      if (!_function) {
        throw Exception();
      }
      return _function;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Function> {
    try {
      const _function = await this._functionModel.findByIdAndDelete(id);
      if (!_function) {
        throw Exception();
      }
      return _function;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Function[]> {
    try {
      return await this._functionModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getFunctionByName(name: string): Promise<Function> {
    try {
      const _function = await this._functionModel.findOne({ name: name });
      if (!_function) {
        throw Exception();
      }
      return _function;
    } catch (e) {
      throw CustomException(e);
    }
  }
}
