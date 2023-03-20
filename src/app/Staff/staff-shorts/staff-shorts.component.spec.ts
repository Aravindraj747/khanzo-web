import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffShortsComponent } from './staff-shorts.component';

describe('StaffShortsComponent', () => {
  let component: StaffShortsComponent;
  let fixture: ComponentFixture<StaffShortsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffShortsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffShortsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
