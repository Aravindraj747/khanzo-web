import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSideNavComponent } from './staff-side-nav.component';

describe('StaffSideNavComponent', () => {
  let component: StaffSideNavComponent;
  let fixture: ComponentFixture<StaffSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffSideNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
