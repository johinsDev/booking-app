import { Module } from '@nestjs/common';
import { AppointmentListener } from './listenerts/appointment.listerner';

@Module({
  providers: [AppointmentListener],
  exports: [AppointmentListener],
})
export default class AppointmentModule {}
