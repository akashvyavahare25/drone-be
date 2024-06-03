import { Model } from 'mongoose';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from 'src/common/exceptions';
import { TriggerScreenJobDto, TriggerScreenJob } from './trigger-screen-job.interface';
import moment = require('moment');
import { isDate } from 'util';

@Injectable()
export class TriggerScreenJobService {

  constructor(
    @InjectModel('TriggerScreenJob') private readonly jobModel: Model<TriggerScreenJob>)
    { }

  async create(job: any):Promise<any> {
    try {
      let startDate = [] as any
      if(job.type==="frequency"){        
        if(job.frequencyPaySchedule==='Once'){
           startDate.push(job.startDate.toISOString())
        }
        else if(job.frequencyPaySchedule==='Monthly'){
          let date=moment(job.startDate[0],"YYYY-MM-DD")          
          let endDate=moment(job.endDate,"YYYY-MM-DD")
         while(date<=endDate){
          var currentDate = moment(date);
          
          var futureMonth = moment(currentDate).add(1, 'M');
          var futureMonthEnd = moment(futureMonth).endOf('month');
            // if(currentDate.date() != futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
                
            //      // futureMonth = futureMonth.add(1, 'd');           //        }
                
           startDate.push(futureMonth.toISOString())
           date=futureMonth;
         }
        
        }
        else if(job.frequencyPaySchedule==='Quaterly'){
          let date=moment(job.startDate[0])          
          let endDate=moment(job.endDate)
         while(date<=endDate){
          var currentDate = moment(date);
          var futureMonth = moment(currentDate).add(4, 'M');
           startDate.push(futureMonth.toISOString())
           date=futureMonth;
         }
        }
        else if(job.frequencyPaySchedule==='Yearly'){
          let date=moment(job.startDate[0],"YYYY-MM-DD")          
          let endDate=moment(job.endDate,"YYYY-MM-DD")
          while(date<endDate){
            var currentDate = moment(date);
            var futureMonth = moment(currentDate).add(1, 'y');
            startDate.push(futureMonth.toISOString())
            date=futureMonth;
          }
       
        }
      }
      return await this.jobModel.create({
        screen:job.screen,
        startDate: startDate,
        endDate: job.endDate,
        frequencyPaySchedule: job.frequencyPaySchedule,
        fixedPaySchedule:job.fixedPaySchedule,
        type:job.type,
      })
      //return await this.jobModel.create(job);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, job: any): Promise<any> {
    try {
      let startDate = [] as any
      if(job.type==="frequency"){        
        if(job.frequencyPaySchedule==='Once'){
           startDate.push(job.startDate.toISOString())
        }
        else if(job.frequencyPaySchedule==='Monthly'){
          let date=moment(job.startDate[0],"YYYY-MM-DD")          
          let endDate=moment(job.endDate,"YYYY-MM-DD")
         while(date<=endDate){
          var currentDate = moment(date);
          
          var futureMonth = moment(currentDate).add(1, 'M');
          var futureMonthEnd = moment(futureMonth).endOf('month');
            // if(currentDate.date() != futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
                
            //      // futureMonth = futureMonth.add(1, 'd');           //        }
                
           startDate.push(futureMonth.toISOString())
           date=futureMonth;
         }
        
        }
        else if(job.frequencyPaySchedule==='Quaterly'){
          let date=moment(job.startDate[0])          
          let endDate=moment(job.endDate)
         while(date<=endDate){
          var currentDate = moment(date);
          var futureMonth = moment(currentDate).add(4, 'M');
           startDate.push(futureMonth.toISOString())
           date=futureMonth;
         }
        }
        else if(job.frequencyPaySchedule==='Yearly'){
          let date=moment(job.startDate[0],"YYYY-MM-DD")          
          let endDate=moment(job.endDate,"YYYY-MM-DD")
          while(date<endDate){
            var currentDate = moment(date);
            var futureMonth = moment(currentDate).add(1, 'y');
            startDate.push(futureMonth.toISOString())
            date=futureMonth;
          }          
        }
      }
      let jobupdate={
        }
      return await this.jobModel.updateOne({ _id: id },
        {startDate: startDate,
        endDate: job.endDate,
        frequencyPaySchedule: job.frequencyPaySchedule,
        fixedPaySchedule:job.fixedPaySchedule,
        type:job.type});
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<TriggerScreenJob> {
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

  async deleteById(id: string): Promise<TriggerScreenJob> {
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

  async getAll(): Promise<TriggerScreenJob[]> {
    try {
      return await this.jobModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

 

}
