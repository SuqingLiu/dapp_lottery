import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LotteryService {
  constructor(private prisma: PrismaService) {}

  async saveMatch(winner: string, prize: string): Promise<any> {
    return this.prisma.lottery.create({
      data: { winner, prize },
    });
  }

  async getLatestWinner(): Promise<string> {
    const latestLottery = await this.prisma.lottery.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        winner: true,
      },
    });
    return latestLottery?.winner;
  }

  async getLatestPrize(): Promise<string> {
    const latestLottery = await this.prisma.lottery.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        prize: true,
      },
    });
    return latestLottery?.prize;
  }
}

