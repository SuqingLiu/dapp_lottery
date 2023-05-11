import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Ticket } from '@prisma/client';
import { TicketCreateInput } from './dto/create-user.dto';


@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(data: TicketCreateInput): Promise<Ticket> {
    return this.prisma.ticket.create({ data });
  }

  async createMultipleTickets(data: TicketCreateInput[]): Promise<Ticket[]> {
    return this.prisma.$transaction(
      data.map((ticketData) => this.prisma.ticket.create({ data: ticketData })),
    );
  }

  async getAllTicketsByUserAddress(userAddress: string): Promise<Ticket[]> {
    const sanitizedUserAddress = userAddress.replace(/\n/g, '');
    console.log(sanitizedUserAddress);
    return this.prisma.ticket.findMany({where: {userAddress: sanitizedUserAddress}});
  }
}
