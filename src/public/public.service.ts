import { Connection, Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Public, PublicDto } from './public.interface';
import { Exception, CustomException } from '../common/exceptions';

import { ApiinterfaceService } from '../apiinterface/apiinterface.service';
import { ScreenService } from '../screen/screen.service';
import { ReportService } from '../report/report.service';
import { MasterService } from '../master/master.service';
import { DynaSchemaService } from '../dynaschema/dynaschema.service';
import { json } from 'express';

@Injectable()
export class PublicService {
  private publicModelMap = new Map<String, mongoose.Model<any>>();
  
  constructor(
    @InjectModel('Public') private readonly publicModel: Model<Public>,
    @InjectConnection() private connection: Connection,
    @Inject(forwardRef(() => ApiinterfaceService))
    private apiinterfaceService: ApiinterfaceService,
    @Inject(forwardRef(() => MasterService))
    private masterService: MasterService,
    @Inject(forwardRef(() => ScreenService))
    private screenService: ScreenService,
    @Inject(forwardRef(() => ReportService))
    private reportService: ReportService,
    @Inject(forwardRef(() => DynaSchemaService))
    private dynaSchemaService: DynaSchemaService,
    // private schedulerRegistry: SchedulerRegistry
  ) { }


  async getDataExt(type: string,user): Promise<any> { //name: string, code: string
    try {
      var resData;
      // console.log('tyNmae', type)
      if(type == 'master'){
        resData = await this.masterService.getAll(user);
      }else if(type == 'screen'){
        resData = await this.screenService.getAll()
      }else if(type == 'report'){
        resData = await this.reportService.getAll();
      }
      return resData;
    } catch (e) {
      // console.log('er', e)
      throw CustomException(e);
    }
  }

   async getDataExt1(type: string, name: string, code: string): Promise<any> { //
    try {
      var resData;
      // console.log('tyNmae', type, name, code)
      if(type == 'master'){
        resData = await this.dynaSchemaService.getMasterDetailListByName(code);
      }else if(type == 'screen'){
        resData = await this.dynaSchemaService.getMasterDetailListByName(code);
      }else if(type == 'report'){
        const data = await this.reportService.findById(code);
        resData = await this.reportService.queryTestPublic(data);
        if(resData.length <= 0){
          resData.status(500).send({
            status: 500,
            message:"Report only with Find Query",
          });
        }
      }
      return resData;
    } catch (e) {
      console.log('er', e)
      throw CustomException(e);
    }
  }

  async getMasterDetailListByName(masterName: string): Promise<any[]> {
    const model = await this.getModelForSchemaName(masterName);
    try {
      return model.find({ status: { $nin: ['null'] } });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getModelForSchemaName(modelName: string): Promise<mongoose.Model<any>> {
    try {
      const model: mongoose.Model<any> | undefined = await this.publicModelMap.get(modelName);
      if (model) {
        return model;
      } else {
        throw Exception;
      }
    } catch (e) {
      throw CustomException(e);
    }
  }


}
