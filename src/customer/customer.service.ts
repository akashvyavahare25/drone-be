import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from '../common/exceptions';
import { Customer, CustomerDto } from './customer.interface';
import { createUUID } from '../common/helpers';

import * as _ from 'lodash'


@Injectable()
export class CustomerService {

  constructor(
    @InjectModel('Customer') private readonly customerModel: Model<Customer>,
    
  ) { }

  async create(customer: CustomerDto): Promise<Customer> {
    //screen.code = 'S_' + screen.name.toUpperCase() + '_' + await createUUID();
    console.log("in serviceeeeeeee",customer)
    try {
      return await this.customerModel.create(customer);
    } catch (e) {
      console.log("in serviceeeeeeee",e)
      throw CustomException(e);
    }
  }

  // async update(id: string, screen: CustomerDto): Promise<Customer> {
  //   try {
  //     const screenData: any = await this.screenModel.update({ _id: id }, screen);
  //     await this.parameterService.deleteByIdPCollection(id)
  //     await this.parameterService.createPCollectionsArray(screen, 'screen');
  //     // const formData: any = [];
  //     // _.each(screen.configuration[0].columns, (column) => {
  //     //   if (column && column.components.length >= 1 && column.components[0]) {
  //     //     formData.push(column.components[0]);
  //     //   }
  //     // })
  //     const obj = {
  //       modelName: screen.code,
  //       formConfig: screen.configuration,
  //       uniqueKey: screen.uniqueKey

  //     }
     
  //     await this.dynaSchemaService.updateSchema(obj)
  //     return screenData
  //   } catch (e) {
  //     throw CustomException(e);
  //   }
  // }

  async findById(id: string): Promise<Customer> {
    try {
      const screen = await this.customerModel.findById(id);
      if (!screen) {
        throw Exception();
      }
      return screen;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByName(name: string): Promise<any> {
    try {
      const company = await this.customerModel.findOne({name:name});
      
      return company._id;
    } catch (e) {
      throw CustomException(e);
    }
  }


  
  async getAll(): Promise<Customer[]> {
    try {
      return await this.customerModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Customer> {
    try {
      const _cutomer = await this.customerModel.findByIdAndDelete(id);
      if (!_cutomer) {
        throw Exception();
      }
      return _cutomer;
    } catch (e) {
      throw CustomException(e);
    }
  }
  async update(id: string,customer: CustomerDto): Promise<any>{
    try {
      const _cutomer = await this.customerModel.update({ _id: id }, customer);
      if (!_cutomer) {
        throw Exception();
      }
      return _cutomer;
    } catch (e) {
      throw CustomException(e);
    }
  }
  // async findByCodeAndId(screenCode: string, id: String): Promise<Screen> {
  //   try {
  //     const screen = await this.screenModel.findOne({ code: screenCode, _id: id });
  //     if (!screen) {
  //       throw Exception();
  //     }
  //     return screen;
  //   } catch (e) {
  //     throw CustomException(e);
  //   }
  // }

  // async findByCode(screenCode: string): Promise<Screen> {
  //   try {
  //     const screen = await this.screenModel.findOne({ code: screenCode });
  //     if (!screen) {
  //       throw Exception();
  //     }
  //     return screen;
  //   } catch (e) {
  //     throw CustomException(e);
  //   }
  // }

}
