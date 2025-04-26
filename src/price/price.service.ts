import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Alert, Price } from './price.entity';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { SetAlertDto } from './set-alert.dto';
import { SwapDto } from './swap.dto';

@Injectable()
export class PriceService {
  // Simulating fetching data (replace with actual logic like API calls or DB queries)
  async getLatestPrices() {
    const prices = {
      usd: 30000, // Example value for USD
      eur: 28000, // Example value for EUR
    };

    // Ensure the USD price exists before accessing it
    if (!prices.usd) {
      throw new Error('USD price not available');
    }

    return { usd: prices.usd, eur: prices.eur }; // Return the simulated prices
  }
  alertRepository: any;
  constructor(
    private priceRepository: Repository<Price>,
  ) {}

  // Fetch Ethereum and Polygon price
  private async fetchPrice(chain: string): Promise<number> {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${chain}&vs_currencies=usd`);
    return response.data[chain].usd;
  }

  // Save price every 5 minutes
  @Cron('*/5 * * * *')
  async savePrice() {
    const chains = ['ethereum', 'polygon'];
    for (const chain of chains) {
      const price = await this.fetchPrice(chain);
      const newPrice = this.priceRepository.create({ chain, price });
      await this.priceRepository.save(newPrice);
    }
  }

  private async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password',
      },
    });

    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to,
      subject,
      text,
    });
  }

  // Method to retrieve hourly prices within the last 24 hours
  async getHourlyPrices() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Query for prices in the last 24 hours
    const prices = await this.priceRepository.find({
      where: { timestamp: MoreThanOrEqual(oneDayAgo) },
      order: { timestamp: 'DESC' },
    });

    // Group results by hour
    const hourlyPrices = prices.reduce((acc, price) => {
      const hour = price.timestamp.getHours();
      if (!acc[hour]) acc[hour] = [];
      acc[hour].push(price);
      return acc;
    }, {});

    return hourlyPrices;
  }

  // Method to set an alert for a specific price
  async setAlert(setAlertDto: SetAlertDto): Promise<Alert> {
    const alert = this.alertRepository.create(setAlertDto);
    return this.alertRepository.save(alert);
    
  }

  

  // Method to calculate the swap rate between Ethereum and Bitcoin
  async calculateSwapRate(swapDto: SwapDto): Promise<{ btcAmount: number; fee: number }> {
    const { amount, fromChain, toChain } = swapDto;

    // Sample rates for simplicity
    const ethToBtcRate = 0.062; // 1 ETH = 0.062 BTC (example rate)
    const feePercentage = 0.03; // 3% fee

    if (fromChain === 'ethereum' && toChain === 'btc') {
      const btcAmount = amount * ethToBtcRate;
      const fee = amount * feePercentage;
      return { btcAmount, fee };
    }

    throw new Error('Unsupported swap chains');
  }

  // Check price changes and send email if it increases by 3%
  @Cron('0 * * * *')
  async checkPriceChange() {
    const chains = ['ethereum', 'polygon'];
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    for (const chain of chains) {
      const [latest, previous] = await this.priceRepository.find({
        where: { chain },
        order: { timestamp: 'DESC' },
        take: 2,
      });

      if (latest && previous && previous.timestamp > oneHourAgo) {
        const priceChange = ((latest.price - previous.price) / previous.price) * 100;
        if (priceChange > 3) {
          await this.sendEmail('hyperhire_assignment@hyperhire.in', `Price Alert for ${chain}`, `The price of ${chain} has increased by ${priceChange}% in the last hour.`);
        }
      }
    }
  }
}
