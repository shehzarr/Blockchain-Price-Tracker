import { Test, TestingModule } from '@nestjs/testing';
import { PriceService } from './price.service';
import { beforeEach, describe, it } from 'node:test';

describe('PriceService', () => {
  let service: PriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceService],
    }).compile();

    service = module.get<PriceService>(PriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
function expect(service: PriceService) {
    throw new Error('Function not implemented.');
}

