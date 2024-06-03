import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from '../common/exceptions';
import { UploadtemplateDto, Uploadtemplate } from './uploadtemplate.interface';
import { DynaSchemaService } from '../dynaschema/dynaschema.service';

@Injectable()
export class UploadtemplateService {
  constructor(
    @InjectModel('Uploadtemplate') private readonly uploadTemplateModel: Model<Uploadtemplate>,
    @Inject(forwardRef(() => DynaSchemaService))
    private dynaSchemaService: DynaSchemaService,
  ) { }

  async create(uploadtemplate: UploadtemplateDto): Promise<Uploadtemplate> {
    try {
      return await this.uploadTemplateModel.create(uploadtemplate);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, uploadtemplate: UploadtemplateDto): Promise<any> {
    try {
      return await this.uploadTemplateModel.update({ _id: id }, uploadtemplate);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Uploadtemplate> {
    try {
      const rules = await this.uploadTemplateModel.findById(id);
      if (!rules) {
        throw Exception();
      }
      return rules;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Uploadtemplate> {
    try {
      const rules = await this.uploadTemplateModel.findByIdAndDelete(id);
      if (!rules) {
        throw Exception();
      }
      return rules;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Uploadtemplate[]> {
    try {
      return await this.uploadTemplateModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }
}
