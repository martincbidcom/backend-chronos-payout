import { Test, TestingModule } from '@nestjs/testing';
import { TempLogService } from './temp-log.service';

describe('TempLogService', () => {
  let service: TempLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempLogService],
    }).compile();

    service = module.get<TempLogService>(TempLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
