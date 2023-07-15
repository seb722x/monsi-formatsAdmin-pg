import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';

export class tableDto {
  @IsString()
  tableName: string;

  @IsString()
  templateName:string;
}