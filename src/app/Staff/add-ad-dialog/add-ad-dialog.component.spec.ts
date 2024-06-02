import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdDialogComponent } from './add-ad-dialog.component';

describe('AddAdDialogComponent', () => {
  let component: AddAdDialogComponent;
  let fixture: ComponentFixture<AddAdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
