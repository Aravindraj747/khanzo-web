import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAdbannerComponent } from './staff-adbanner.component';

describe('StaffAdbannerComponent', () => {
  let component: StaffAdbannerComponent;
  let fixture: ComponentFixture<StaffAdbannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffAdbannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffAdbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
