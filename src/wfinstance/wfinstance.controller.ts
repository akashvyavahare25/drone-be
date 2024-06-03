import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Wfinstance, WfinstanceDto } from './wfinstance.interface';
import { WfinstanceService } from './wfinstance.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LoggingInterceptor } from '../common/interceptor';
const multer = require('multer');
var fs = require('fs-extra');

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    // console.log(req.body, 'req req multer ', req)
    const { wfInstanceId, _id } = req.body
    const dir = './workflow_files/' + wfInstanceId + '/' + _id
    // const dir = './uploads'
    fs.exists(dir, async (exist: any) => {
      if (!exist) {
        await fs.mkdirsSync(dir)
        return cb(null, dir)
      }
      return cb(null, dir)
    })
  },
  filename: (req: any, file: any, cb: any) => {
    // const { userId } = req.body
    cb(null, Date.now() + file.originalname)
  }
})

// const upload = multer({ storage })


@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/wfinstance')
export class WfinstanceController {

  constructor(private readonly wfinstanceService: WfinstanceService) { }

  @Post()
  async create(@Req() req: Request, @Body() wfinstanceDto: WfinstanceDto): Promise<Wfinstance> {
    return this.wfinstanceService.create(req.body);
  }

  // @Post('/wf-trigger')
  // async triggerWf(@Req() req: Request, @Body() wfinstanceDto: WfinstanceDto): Promise<Wfinstance> {
  //   return this.wfinstanceService.triggerWf(req.body);
  // }

  @Get()
  async getAll(@Req() req: Request): Promise<Wfinstance[]> {
    return this.wfinstanceService.getAll(req.user);
  }

  @Get('/inprogress-wfinstance')
  async getAllInprogrssWfinstance(): Promise<Wfinstance[]> {
    return this.wfinstanceService.getAllInprogrssWfinstance();
  }

  @Get(':WfinstanceId')
  async getOne(@Param('WfinstanceId') WfinstanceId: string): Promise<Wfinstance> {
    return this.wfinstanceService.findById(WfinstanceId);
  }

  @Delete(':WfinstanceId')
  async delete(@Param('WfinstanceId') WfinstanceId: string): Promise<Wfinstance> {
    return this.wfinstanceService.deleteById(WfinstanceId);
  }

  // @Put(':WfinstanceId')
  // async update(@Param('WfinstanceId') WfinstanceId: string, @Req() req: Request): Promise<Wfinstance> {
  //   return this.wfinstanceService.update(WfinstanceId, req.body);
  // }

  @Put('/status-update/:status')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: storage
  }))
  async statusUpdate(@Param('status') status: string, @Req() req: any, @Body() nfData: any): Promise<Wfinstance> {
    req.body['files'] = req.files;
    return this.wfinstanceService.statusUpdate(status, JSON.parse(JSON.stringify(req.body)), req);
  }

  // @Put('/status-update1')
  // @UseInterceptors(FilesInterceptor('files', 10, {
  //   storage: storage
  // }))
  // async statusUpdate1(@Req() req: Request): Promise<any> {
  //   return this.wfinstanceService.statusUpdate1(req);
  // }

  @Post('download-nf-attachment')
  async downloadNfAttachment(@Req() req: Request, @Body() body: any, @Res() res: Response): Promise<any> {
    res.download(body.destination + '/' + body.filename, body.filename, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  }
}