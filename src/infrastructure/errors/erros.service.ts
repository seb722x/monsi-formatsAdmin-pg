import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository, Table, TableColumn, TableForeignKey, TableUnique  } from 'typeorm';




@Injectable()
export class ErrorService {
    
    private readonly logger = new Logger('ProductsService');



    handleDBExceptions( error: any ) {

        if ( error.code === '23505' )
          throw new BadRequestException(error.detail);
        
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
    
      }

    notFoundError(error:any){

        this.logger.error(error);
        throw new NotFoundException(`not found `);
        
    }
}