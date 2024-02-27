import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSixComponent } from './option-six.component';

describe('OptionSixComponent', () => {
  let component: OptionSixComponent;
  let fixture: ComponentFixture<OptionSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionSixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
