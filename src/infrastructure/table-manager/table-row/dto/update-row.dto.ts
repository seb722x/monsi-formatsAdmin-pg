import { PartialType } from '@nestjs/mapped-types';
import { RowDto } from './create-row.dto';
import { IsNumber, IsObject } from 'class-validator';

export class UpdateRawDto extends PartialType(RowDto) {

    @IsNumber()
    id: number;

    [key: string]: any;
}