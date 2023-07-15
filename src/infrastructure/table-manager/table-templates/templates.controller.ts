import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TemplateService } from './templates.service';
import { TemplateDto } from './dto/create-temp.dto';
import { UpdateTemplateDto } from './dto/update-temp.dto';


@Controller('templates')
export class TemplatesController {
  constructor(private readonly templateService: TemplateService) {}


  @Post('create')   //crear el template
    createTemplate(@Body() templateDto: TemplateDto) {
      return this.templateService.createTemplate(templateDto);
  }
  
  @Get('find-all')
     getAllTemplates() {
      return  this.templateService.findAllTemplates();
  } 

  @Get('find-name/:name')
    getTemplateByName(@Param('name') name: string) {
      return this.templateService.findTemplateByName(name);
  }
  
  @Patch('update/:name')
  update(
    @Param('name' ) name: string, 
    @Body() updateTemplateDto: UpdateTemplateDto
  ) {
    return this.templateService.updateTemplate( name, updateTemplateDto );
  }


  @Delete('delete/:name')
  remove(@Param('name',  ) name: string) {
    return this.templateService.removeTemplate( name );
  }

};


