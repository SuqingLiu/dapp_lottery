import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TicketsService } from './user.service';
import { Ticket } from '@prisma/client';
import { TicketCreateInput } from './dto/create-user.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async createTicket(@Body() ticketData: TicketCreateInput): Promise<Ticket> {
    return this.ticketsService.createTicket(ticketData);
  }

  @Post('multiple')
  async createMultipleTickets(
    @Body() ticketsData: TicketCreateInput[],
  ): Promise<Ticket[]> {
    return this.ticketsService.createMultipleTickets(ticketsData);
  }

  @Get('user/:userAddress')
  async getAllTicketsByUserAddress(
    @Param('userAddress') userAddress: string,
  ): Promise<Ticket[]> {
    return this.ticketsService.getAllTicketsByUserAddress(userAddress);
  }
}
