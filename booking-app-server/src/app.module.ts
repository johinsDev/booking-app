import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import AppointmentModule from './appointments/appointment.module';
import { BookingModule } from './booking/booking.module';
import configuration from './config/configuration';
import { EmployeeModule } from './employee/employee.module';
import { HealthController } from './health/health.controller';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        prettyPrint: process.env.NODE_ENV !== 'production',
      },
    }),
    TerminusModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DATABASE').CONNECTION,
          host: configService.get('DATABASE').HOST,
          port: configService.get('DATABASE').PORT,
          username: configService.get('DATABASE').USERNAME,
          password: configService.get('DATABASE').PASSWORD,
          database: configService.get('DATABASE').DATABASE,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: true,
          namingStrategy: new SnakeNamingStrategy(),
          cache: {
            type: 'ioredis',
            options: {
              keyPrefix: 'DATABASE_',
              host: configService.get('DATABASE.DATABASE_REDIS').HOST,
              port: configService.get('DATABASE.DATABASE_REDIS').PORT,
            },
          },
        };
      },
    }),
    BookingModule,
    EmployeeModule,
    ServiceModule,
    AppointmentModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
