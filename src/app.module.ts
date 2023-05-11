import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { LotteryModule } from './lottery/lottery.module';
import { UserModule } from './user/user.module';



@Module({
  imports: [LotteryModule, UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}