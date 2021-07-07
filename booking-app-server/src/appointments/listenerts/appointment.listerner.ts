import { nanoid } from 'nanoid';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import Appointment from '../entities/appointment.entity';

@EventSubscriber()
export class AppointmentListener
  implements EntitySubscriberInterface<Appointment>
{
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Appointment;
  }

  beforeInsert(event: InsertEvent<Appointment>): void {
    event.entity.token = nanoid();
  }
}
