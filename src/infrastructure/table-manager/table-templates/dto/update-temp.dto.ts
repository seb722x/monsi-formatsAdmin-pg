import { PartialType } from '@nestjs/mapped-types';
import { TemplateDto } from './create-temp.dto';


export class UpdateTemplateDto extends PartialType(TemplateDto){};