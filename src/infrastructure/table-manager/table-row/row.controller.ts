import {  Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RowService } from './row.service';
import { RowDto } from './dto/create-row.dto';
import { findRowDto } from './dto/find-row.dto';
import { UpdateRawDto } from './dto/update-row.dto';




@Controller('row')
export class RowController {
  constructor(

    private readonly rowService:RowService,

  ) {}
  

  @Post('insert')
  async insertRow(@Body() data: any){
   return await this.rowService.insertRowIntoTable(data)
  }

  @Delete('delete')
  async deleteRow(@Body() data: any){
   return await this.rowService.deleteRowByName(data)
  }

  @Patch('update')
  async updateRow(@Body() data: any){
    return await this.rowService.updateDataById(data)
  }

  @Get('find-id')
  async findDataById(@Body() data: findRowDto){
    return await this.rowService.findRowById(data);
  }

  @Get('find-all/:tableName')
  async findAllRows(@Param('tableName') tableName: string){
    return await this.rowService.findAllRows(tableName);
  }
    
}

