import { Test, TestingModule } from '@nestjs/testing';
import { CeritificatesController } from './ceritificates.controller';

describe('CeritificatesController', () => {
  let controller: CeritificatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CeritificatesController],
    }).compile();

    controller = module.get<CeritificatesController>(CeritificatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
