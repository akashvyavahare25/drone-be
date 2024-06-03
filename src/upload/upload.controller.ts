import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, UploadedFiles, Res, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Upload, UploadDto } from './upload.interface';
import { UploadService } from './upload.service';
import { DynaSchemaService } from 'src/dynaschema/dynaschema.service';
import { FileInterceptor, FilesInterceptor, MulterModule } from '@nestjs/platform-express'
import { LoggingInterceptor } from '../common/interceptor';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/defineupload')
export class UploadController {

  constructor(private readonly uploadService: UploadService, private readonly dynaSchemaService: DynaSchemaService) { }

  @Post()
  async create(@Req() req: Request, @Body() uploadDto: UploadDto): Promise<Upload> {
    return this.uploadService.create(req.body);
  }

  @Get()
  async getAll(): Promise<Upload[]> {
    return this.uploadService.getAll();
  }

  @Get(':UploadId')
  async getOne(@Param('UploadId') UploadId: string): Promise<Upload> {
    return this.uploadService.findById(UploadId);
  }

  @Get('/screen/:screenName')
  async getOnebyScreen(@Param('screenName') screenName: string): Promise<Upload> {
    console.log("screenName", screenName)
    return this.uploadService.findByScreen(screenName);
  }
  @Delete(':UploadId')
  async delete(@Param('UploadId') UploadId: string): Promise<Upload> {
    return this.uploadService.deleteById(UploadId);
  }

  @Put(':UploadId')
  async update(@Param('UploadId') UploadId: string, @Req() req: Request): Promise<Upload> {
    return this.uploadService.update(UploadId, req.body);
  }

  @Post('csvtojsonfile/')
  @UseInterceptors(FileInterceptor('files'))
  async getjsonRes(@UploadedFile() files: any, @Req() req: Request, @Res() res: any) {
    var datares: any;
    try {
      if (files == undefined) {
        return res.status(400).send("Please upload a CSV file!");
      }
      else {
        await this.uploadService.getjsonRes(files, req).then((resp: any) => {
          datares = resp;
        });
        res.status(200).json({
          status: 200,
          Data: datares, //data
          message:
            "File converted successfully: " + files.originalname,
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: error + "Could not coverted the file: " + files.originalname,
      });
    }
  }

  @Post('uploadfile/')
  @UseInterceptors(FileInterceptor('files'))
  async getjsonResh(@UploadedFile() files: any, @Req() req: Request, @Res() res: any) {
    // console.log('files', files, 'req', req)
    var datares: any;
    try {
      if (files == undefined) {
        return res.status(400).send("Please upload a CSV file!");
      } else {
        if (req.body.type == 'CC') {
          await this.uploadService.getjsonRes(files, req.body).then((resp: any) => {
            // console.log('resp ***', resp)
            datares = resp;
          });
        } else if ((req.body.type == 'RR')) {
          await this.uploadService.getjsonResRR(files, req.body).then((resp: any) => {
            datares = resp;
          });
        } else if ((req.body.type == 'RC')) {
          await this.uploadService.getjsonResRC(files, req.body).then((resp: any) => {
            datares = resp;
          });
        }

        if (datares.length > 0) {
          if (req.body.key == 'screen') {
            await this.dynaSchemaService.screenFileUpload1(files.originalname, datares, req).then((resp: any) => {
              datares = resp;
            });
          } else {
            await this.dynaSchemaService.masterFileUpload1(files.originalname, datares, req).then((resp: any) => {
              datares = resp
            });
          }
          res.status(200).json({
            status: 200,
            Data: datares, //data
            message:
              "File converted successfully: " + files.originalname,
          });
        } else {
          res.status(500).send({
            status: 500,
            message: "Could not coverted the file, Wrong format selcted " + files.originalname,
          });
        }
      }
    } catch (error) {
      // console.log('error errorerrorerror ', error)
      res.status(500).send({
        status: 500,
        message: error + "Could not coverted the file: " + files.originalname,
      });
    }
  }

}