import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Workflow, WorkflowDto } from './workflow.interface';
import { Exception, CustomException } from 'src/common/exceptions';

@Injectable()
export class WorkflowService {

  constructor(
    @InjectModel('Workflow') private readonly workflowModel: Model<Workflow>,
  ) { }

  /**
   * @throws duplicate key error when
   */
  async create(workflow: WorkflowDto): Promise<any> {
    try {
      // let wfData: any = await this.workflowModel.create(workflow);
      // wfData['code'] = 200;
      // return wfData;

      //Below code is work for only single workflow save for single screen

      const wfDataCheck = await this.findByScreenCode(workflow.targetObject, workflow.rule);
      if (wfDataCheck) {
        return { code: 1010, message: 'This screen workflow already exists with this rule, You cannot create duplicte workflow with same data' }
      } else {
        let wfData: any = await this.workflowModel.create(workflow);
        wfData['code'] = 200;
        return wfData
      }
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, workflow: WorkflowDto): Promise<any> {
    try {
      return await this.workflowModel.update({ _id: id }, workflow);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Workflow[]> {
    try {
      return await this.workflowModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Workflow> {
    try {
      const workflow = await this.workflowModel.findById(id);
      if (!workflow) {
        throw Exception();
      }
      return workflow;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Workflow> {
    try {
      const workflow = await this.workflowModel.findByIdAndDelete(id);
      if (!workflow) {
        throw Exception();
      }
      return workflow;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByScreenCode(targetObject: string, rule: any): Promise<any> {
    try {
      return await this.workflowModel.findOne({ targetObject: targetObject, rule: rule });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByScreenCodeAndTriggerName(targetObject: string, triggerOn: any): Promise<any> {
    try {
      // commented line work for fetch single workflow
      // return await this.workflowModel.findOne({ targetObject: targetObject, triggerOn: triggerOn });

      // below line work for fetch all workflows for one screen

      return await this.workflowModel.find({ "$and": [{ targetObject: targetObject, triggerOn: triggerOn }, { "rule": { "$exists": true } }] });

      // return await this.workflowModel.find({ targetObject: targetObject, triggerOn: triggerOn });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getRule(id: string): Promise<Workflow> {
    try {
      const workflow = await this.workflowModel.findOne({ rule: id });
      if (!workflow) {
        throw Exception();
      }
      return workflow;
    } catch (e) {
      throw CustomException(e);
    }
  }

}
