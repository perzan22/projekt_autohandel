import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchedOffersComponent } from './searched-offers.component';

describe('SearchedOffersComponent', () => {
  let component: SearchedOffersComponent;
  let fixture: ComponentFixture<SearchedOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchedOffersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchedOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
