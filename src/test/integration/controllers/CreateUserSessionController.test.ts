import CreateUserSessionController from '@/infrastructure/api/controllers/CreateUserSessionController';

describe('Controller - CreateUserSession', () => {
  test('should instantiate CreateUserSessionUseCase properly', async () => {
    new CreateUserSessionController();
  });
});
