import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors, Res, UploadedFiles, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Customer, CustomerDto } from './customer.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomerService } from './customer.service';
import { LoggingInterceptor } from '../common/interceptor';

const multer = require('multer');
var fs = require('fs-extra');

// const storage = multer.diskStorage({
//   destination: (req: any, file: any, cb: any) => {
//     console.log( 'req req multer ')
//     const { wfInstanceId, _id } = req.body
//     const dir = './customer_logo/' + req.body.name
//     // const dir = './uploads'
//     fs.exists(dir, async (exist: any) => {
//       if (!exist) {
//         await fs.mkdirsSync(dir)
//         return cb(null, dir)
//       }
//       return cb(null, dir)
//     })
//   },
//   filename: (req: any, file: any, cb: any) => {
//     // const { userId } = req.body
//     cb(null, Date.now() + file.originalname)
//   }
// })
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/customer')
@UseInterceptors(LoggingInterceptor)
export class CustomerController {

  constructor(private readonly customerService: CustomerService) { }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('logo',{
     storage:multer.diskStorage({
      destination: './logo_images/',
      filename: (req: any, logo: any, cb: any) => {
        cb(null, Date.now() + logo.originalname)
      },
    }),   
    },
  ))
  async create(@UploadedFile() file: any, @Req() req: any, @Body() customerDto: CustomerDto): Promise<Customer>{   
    req.body['logo'] = file
    return this.customerService.create(JSON.parse(JSON.stringify(req.body)));
  }

  
  @Get()
  async getAll(): Promise<Customer[]> {
    return this.customerService.getAll();
  }

  @Get(':CustomerId')
  async getOne(@Param('CustomerId') CustomerId: string): Promise<Customer> {
    return this.customerService.findById(CustomerId);
  }

  @Delete(':CustomerId')
  async delete(@Param('CustomerId') CustomerId: string): Promise<Customer> {
    return this.customerService.deleteById(CustomerId);
  }

  @Put(':CustomerId')
  @UseInterceptors(FileInterceptor('logo',{
    storage:multer.diskStorage({
     destination: './logo_images/',
     filename: (req: any, logo: any, cb: any) => {
       cb(null, Date.now() + logo.originalname)
     },
   }),   
   },
 ))
  async update(@Param('CustomerId') CustomerId: string,@UploadedFile() file: any,@Req() req: any,@Body() customerDto: CustomerDto): Promise<any> {
    req.body['logo'] = file
    return this.customerService.update(CustomerId, JSON.parse(JSON.stringify(req.body)));
  }
}