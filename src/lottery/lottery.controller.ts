import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LotteryService } from './lottery.service';

@Controller('Lottery')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Post('match')
  async saveMatch(@Body('winner') winner: string, @Body('prize') prize: string) {
    return this.lotteryService.saveMatch(winner, prize);
  }

  @Get('winner')
  async getLatestWinner() {
    return this.lotteryService.getLatestWinner();
  }

  @Get('prize')
  async getLatestPrize() {
    return this.lotteryService.getLatestPrize();
  }
}

