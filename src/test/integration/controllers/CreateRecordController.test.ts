import CreateRecordController from '@/infrastructure/api/controllers/CreateRecordController';

describe('Controller - CreateRecord', () => {
  test('should instantiate CreateRecordUseCase properly', async () => {
    new CreateRecordController();
  });
});
