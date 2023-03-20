import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCreationComponent } from './staff-creation.component';

describe('StaffCreationComponent', () => {
  let component: StaffCreationComponent;
  let fixture: ComponentFixture<StaffCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
