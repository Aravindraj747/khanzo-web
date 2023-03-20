import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffReelsComponent } from './staff-reels.component';

describe('StaffReelsComponent', () => {
  let component: StaffReelsComponent;
  let fixture: ComponentFixture<StaffReelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffReelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffReelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
