import { Controller, Get, Post, Body } from '@nestjs/common';
import { PriceService } from './price.service';
import { SetAlertDto } from './set-alert.dto';
import { SwapDto } from './swap.dto';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  // @Get('latest')
  // getLatestPrices() {
  //   return this.priceService.getLatestPrices();
  // }
  @Get('hourly')
  getHourlyPrices() {
    return this.priceService.getHourlyPrices();
  }

  @Post('set-alert')
  setPriceAlert(@Body() alertDto: SetAlertDto) {
    return this.priceService.setAlert(alertDto);
  }

  @Post('swap-rate')
  calculateSwapRate(@Body() swapDto: SwapDto) {
    return this.priceService.calculateSwapRate(swapDto);
  }
}
