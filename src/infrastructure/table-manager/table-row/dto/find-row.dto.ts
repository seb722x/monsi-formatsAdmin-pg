import { PartialType } from '@nestjs/mapped-types';
import { RowDto } from './create-row.dto';
import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class findRowDto extends PartialType(RowDto) {

    @IsNumber()
    id: number;

    
    [key: string]: any;
}