import { TestBed } from '@angular/core/testing';

import { AdminauthguardGuard } from './adminauthguard.guard';

describe('AdminauthguardGuard', () => {
  let guard: AdminauthguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminauthguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
