import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineShopComponent } from './offline-shop.component';

describe('OfflineShopComponent', () => {
  let component: OfflineShopComponent;
  let fixture: ComponentFixture<OfflineShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineShopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
