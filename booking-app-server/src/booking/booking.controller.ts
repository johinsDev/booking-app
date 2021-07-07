import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get('/:uuid')
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('token') token: string,
  ) {
    return this.bookingService.findOne(uuid, token);
  }

  @Patch(':uuid')
  cancel(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.bookingService.cancel(uuid);
  }
}
