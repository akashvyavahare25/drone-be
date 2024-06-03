import { Connection, Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Job, JobDto } from './job.interface';
import { Exception, CustomException } from '../common/exceptions';
const schedule = require('node-schedule');
import { ApiinterfaceService } from '../apiinterface/apiinterface.service';

@Injectable()
export class JobService {
  private jobModelMap = new Map<String, mongoose.Model<any>>();
  constructor(
    @InjectModel('Job') private readonly jobModel: Model<Job>,
    @InjectConnection() private connection: Connection,
    @Inject(forwardRef(() => ApiinterfaceService))
    private apiinterfaceService: ApiinterfaceService,
    // private schedulerRegistry: SchedulerRegistry
  ) { }

  onModuleInit() {
    this.jobModel.find().exec().then((jms: any) => {
      // console.log('jms jms jms', jms)
      jms.map((jm: any) => {
        this.addJobModelToMap(jm.model_name, jm.schema_config);
        const job = schedule.scheduleJob(jm.cron_exp, () => this.jobScheduler(jm))
        // console.log('job', job)
        // const job = new CronJob(`0 14 13 * 1-12 FRI`, () => this.jobScheduler(jm));
        // this.schedulerRegistry.addCronJob(`${Date.now()}-${jm.name}`, job);
        // job.start();
      });
    });
  }

  async findByCode(jobCode: string): Promise<Job> {
    try {
      const job = await this.jobModel.findOne({ code: jobCode });
      if (!job) {
        throw Exception();
      }
      return job;
    } catch (e) {
      throw CustomException(e);
    }
  }

  private async addJobModelToMap(modelName: string, schemaConfig: any) {
    try {
      await this.jobModelMap.set(modelName, this.connection.model(modelName, new mongoose.Schema(schemaConfig, { strict: false })));
    } catch (e) {
      throw CustomException(e);
    }
  }


  private async jobScheduler(jm: any) {
    // console.log('jobScheduler jobScheduler ', jm);
    try {
      const model = await this.getModelForModelName(jm.model_name);
      const apiinterface: any = await this.apiinterfaceService.findByName(jm.process.interfacename);
      // console.log('apiinterface apiinterface apiinterface', apiinterface)
      const resDataOfInterface: any = await this.apiinterfaceService.getRes(apiinterface);
      // console.log('resDataOfInterface resDataOfInterface resDataOfInterface', resDataOfInterface)
      const resData = await model.insertMany(resDataOfInterface.response.docs);
      // console.log('resData resData resData', resData)
    } catch (e) {
      // console.log('e e e e e e e e', e)
      throw CustomException(e);
    }
  }

  async getModelForModelName(modelName: string): Promise<mongoose.Model<any>> {
    try {
      const model: mongoose.Model<any> | undefined = await this.jobModelMap.get(modelName);
      if (model) {
        return model;
      } else {
        throw Exception;
      }
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByName(jobName: string): Promise<Job> {
    try {
      const job = await this.jobModel.findOne({ model_name: jobName });
      // console.log('job',job)
      if (!job) {
        throw Exception();
      }
      return job;
    } catch (e) {
      console.log('e', e)
      throw CustomException(e);
    }
  }


  async findDataByName(jobName: string): Promise<any> {
    try {
      const model = await this.getModelForModelName(jobName);
      console.log('job', model)
      if (!model) {
        throw Exception();
      }
      return model.find({ status: { $nin: ['null'] } });
    } catch (e) {
      console.log('e', e)
      throw CustomException(e);
    }
  }


  /**
   * @throws duplicate key error when
   */
  async create(job: any): Promise<any> {
    try {
      job['schema_config'] = { name: { type: 'string' } };
      job['model_name'] = 'apiinterface_' + job.name + '_' + job.process.table;
      let jmData: any = await this.jobModel.create(job);
      await this.addJobModelToMap(job.model_name, job.schema_config);
      // const model = await this.getModelForModelName(job.model_name);
      // console.log('modelName modelName modelName', model)

      //   const resData = await model.create({ name: 'name', firstname: 'firstname', lastname: 'lastname', ghjgj: 'ghjgj' })
      //   console.log('resData resData resData', resData)
      return jmData;
    } catch (e) {
      console.log('e e e e e e ', e)
      throw CustomException(e);
    }
  }

  async update(id: string, job: JobDto): Promise<any> {
    try {
      return await this.jobModel.update({ _id: id }, job);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Job[]> {
    try {
      return await this.jobModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Job> {
    try {
      const job = await this.jobModel.findById(id);
      if (!job) {
        throw Exception();
      }
      return job;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Job> {
    try {
      const job = await this.jobModel.findByIdAndDelete(id);
      if (!job) {
        throw Exception();
      }
      return job;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByScreenCode(targetObject: string): Promise<any> {
    try {
      return await this.jobModel.findOne({ targetObject: targetObject });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByScreenCodeAndTriggerName(targetObject: string, triggerOn: any): Promise<any> {
    try {
      return await this.jobModel.findOne({ targetObject: targetObject, triggerOn: triggerOn });
    } catch (e) {
      throw CustomException(e);
    }
  }

}
