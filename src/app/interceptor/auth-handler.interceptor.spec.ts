import { TestBed } from '@angular/core/testing';

import { AuthHandlerInterceptor } from './auth-handler.interceptor';

describe('AuthHandlerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthHandlerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthHandlerInterceptor = TestBed.inject(AuthHandlerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
