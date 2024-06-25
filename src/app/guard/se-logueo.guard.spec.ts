import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { seLogueoGuard } from './se-logueo.guard';

describe('seLogueoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => seLogueoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
