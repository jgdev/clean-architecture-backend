import { createApi } from '@/infrastructure/api';
import { prepareTestEnvironment } from '../unit/utils/InMemory.bootstrap';

describe('Api', () => {
  let api;

  beforeEach(async () => {
    const deps = await prepareTestEnvironment();
    api = createApi(deps);
  });

  test('should handle NotFound error properly', () => {
    throw new Error('not implemented');
  });

  test('should handle ValidationError error properly', () => {
    throw new Error('not implemented');
  });

  test('should handle UnauthorizedError error properly', () => {
    throw new Error('not implemented');
  });

  test('should handle InternalError error properly', () => {
    throw new Error('not implemented');
  });
});
