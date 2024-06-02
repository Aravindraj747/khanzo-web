import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShopCategoryDailogComponent } from './edit-shop-category-dailog.component';

describe('EditShopCategoryDailogComponent', () => {
  let component: EditShopCategoryDailogComponent;
  let fixture: ComponentFixture<EditShopCategoryDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShopCategoryDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditShopCategoryDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
