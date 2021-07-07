import { Controller, Get, Param } from '@nestjs/common';
import { ServiceService } from './service.service';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id/employees')
  findEmployeesByService(@Param('id') id: string) {
    return this.serviceService.findEmployeesByService(+id);
  }
}
