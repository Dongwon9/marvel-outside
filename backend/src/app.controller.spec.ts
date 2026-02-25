import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const mockAppService: Partial<AppService> = {
    getHealth: jest.fn().mockReturnValue('OK'),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();
    appController = module.get<AppController>(AppController);
  });

  it('should return "OK"', () => {
    expect(appController.getHealth()).toBe('OK');
  });
});
