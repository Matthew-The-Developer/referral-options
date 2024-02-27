import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionFourComponent } from './option-four.component';

describe('OptionFourComponent', () => {
  let component: OptionFourComponent;
  let fixture: ComponentFixture<OptionFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionFourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
