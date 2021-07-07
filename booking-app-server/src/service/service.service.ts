import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  findEmployeesByService(serviceId: number) {
    return this.employeeRepository
      .createQueryBuilder('employee')
      .innerJoinAndSelect('employee.employeeServices', 'ES')
      .where('ES.serviceId = :serviceId', { serviceId })
      .cache(1000 * 60)
      .getMany();
  }

  findAll() {
    return this.serviceRepository.find({
      cache: 1000 * 60,
    });
  }
}
