import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDailyTaskComponent } from './staff-daily-task.component';

describe('StaffDailyTaskComponent', () => {
  let component: StaffDailyTaskComponent;
  let fixture: ComponentFixture<StaffDailyTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffDailyTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDailyTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
