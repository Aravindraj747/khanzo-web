import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffInstagramComponent } from './staff-instagram.component';

describe('StaffInstagramComponent', () => {
  let component: StaffInstagramComponent;
  let fixture: ComponentFixture<StaffInstagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffInstagramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffInstagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
