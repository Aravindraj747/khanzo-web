import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAdComponent } from './home-ad.component';

describe('HomeAdComponent', () => {
  let component: HomeAdComponent;
  let fixture: ComponentFixture<HomeAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeAdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
