import { IsArray, IsOptional, IsString } from 'class-validator';


export class TemplateDto {
    @IsString()
    name: string;


    @IsArray()
    columns: Record<string, any>[];

    @IsOptional()
    @IsArray()
    relations?: Record<string, any>[]

   
  }