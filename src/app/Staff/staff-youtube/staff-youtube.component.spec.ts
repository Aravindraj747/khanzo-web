import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffYoutubeComponent } from './staff-youtube.component';

describe('StaffYoutubeComponent', () => {
  let component: StaffYoutubeComponent;
  let fixture: ComponentFixture<StaffYoutubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffYoutubeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
