import ListRecordsController from '@/infrastructure/api/controllers/ListRecordsController';

describe('Controller - ListRecords', () => {
  test('should instantiate ListRecordsUseCase properly', async () => {
    new ListRecordsController();
  });
});
