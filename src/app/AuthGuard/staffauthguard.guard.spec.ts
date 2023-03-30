import { TestBed } from '@angular/core/testing';

import { StaffauthguardGuard } from './staffauthguard.guard';

describe('StaffauthguardGuard', () => {
  let guard: StaffauthguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StaffauthguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
