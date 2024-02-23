import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionOneComponent } from './option-one/option-one.component';
import { OptionTwoComponent } from './option-two/option-two.component';
import { OptionThreeComponent } from './option-three/option-three.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    OptionOneComponent,
    OptionTwoComponent,
    OptionThreeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
