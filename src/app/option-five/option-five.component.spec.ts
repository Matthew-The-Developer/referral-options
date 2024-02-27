import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionFiveComponent } from './option-five.component';

describe('OptionFiveComponent', () => {
  let component: OptionFiveComponent;
  let fixture: ComponentFixture<OptionFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionFiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
