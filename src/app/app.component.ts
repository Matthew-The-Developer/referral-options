import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionOneComponent } from './option-one/option-one.component';
import { OptionTwoComponent } from './option-two/option-two.component';
import { OptionThreeComponent } from './option-three/option-three.component';
import { OptionFourComponent } from './option-four/option-four.component';
import { OptionFiveComponent } from './option-five/option-five.component';
import { OptionSixComponent } from './option-six/option-six.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    OptionOneComponent,
    OptionTwoComponent,
    OptionThreeComponent,
    OptionFourComponent,
    OptionFiveComponent,
    OptionSixComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
