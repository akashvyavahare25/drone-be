import { Injectable } from '@nestjs/common';
import { Exception, CustomException } from '../common/exceptions';
import { DynaSchemaService } from '../dynaschema/dynaschema.service';

@Injectable()
export class GenericService {

  constructor(private readonly dynaSchemaService: DynaSchemaService) { }

  async getAll(modelName: string): Promise<any> {
    try {
      let model = await this.dynaSchemaService.getModelForSchemaName(modelName);
      return model.find().exec();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getOneById(modelName: string, id: string): Promise<any> {
    try {
      let model = await this.dynaSchemaService.getModelForSchemaName(modelName);
      return model.findById(id);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async create(modelName: string, document: any): Promise<any> {
    try {
      let model = await this.dynaSchemaService.getModelForSchemaName(modelName);
      return model.create(document);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(modelName: string, id: string): Promise<any> {
    try {
      const document: any = await (await this.dynaSchemaService.getModelForSchemaName(modelName)).findByIdAndDelete(id);
      if (!document) {
        throw Exception();
      }
      return document;
    } catch (e) {
      throw CustomException(e);
    }
  }

}
