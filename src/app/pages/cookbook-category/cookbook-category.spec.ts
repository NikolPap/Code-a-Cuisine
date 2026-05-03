import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookbookCategory } from './cookbook-category';

describe('CookbookCategory', () => {
  let component: CookbookCategory;
  let fixture: ComponentFixture<CookbookCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookbookCategory],
    }).compileComponents();

    fixture = TestBed.createComponent(CookbookCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
