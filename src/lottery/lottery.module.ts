import { Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotteryController } from './lottery.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [LotteryService, PrismaService],
  controllers: [LotteryController],
})
export class LotteryModule {}
