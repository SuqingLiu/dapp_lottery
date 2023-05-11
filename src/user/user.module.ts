import { Module } from '@nestjs/common';
import { TicketsService } from './user.service';
import { TicketsController } from './user.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [TicketsService, PrismaService],
  controllers: [TicketsController],
})
export class UserModule {}
