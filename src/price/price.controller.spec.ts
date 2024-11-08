import { Test, TestingModule } from '@nestjs/testing';
import { PriceController } from './price.controller';
import { beforeEach, describe, it } from 'node:test';

describe('PriceController', () => {
  let controller: PriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceController],
    }).compile();

    controller = module.get<PriceController>(PriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
function expect(controller: PriceController) {
    throw new Error('Function not implemented.');
}

