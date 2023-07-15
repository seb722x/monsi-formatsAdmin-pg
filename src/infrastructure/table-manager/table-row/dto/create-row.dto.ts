import { IsArray, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class RowDto {

  @IsString()
  tableName: string;


  @IsArray()
  @ValidateNested()
  @IsObject({ each: true })
  insertions: Record<string, any>[];
}