import ListOperationsController from '@/infrastructure/api/controllers/ListOperationsController';

describe('Controller - ListOperations', () => {
  test('should instantiate ListOperationsUseCase properly', async () => {
    new ListOperationsController();
  });
});
