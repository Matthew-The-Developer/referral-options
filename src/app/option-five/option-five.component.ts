import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DCINephrologist, Referral, ReferralGroup, ReferralSource, isDCINephrologist } from '../models/referral.model';
import { adjectives, names, uniqueNamesGenerator } from 'unique-names-generator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';



@Component({
  selector: 'app-option-five',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './option-five.component.html',
  styleUrl: './option-five.component.scss'
})
export class OptionFiveComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  group = this.fb.group({
    referral: new FormControl<Referral | null>(null, [Validators.required]),
    unknownComment: [{ value: '', disabled: true }],
  });

  referralValue = signal<Referral | null>(null);
  referralisUnknown = effect(() => {
    const source = this.referralValue()?.source;
    if (
      source === ReferralSource.Hospital ||
      source === ReferralSource.PracticeGroup ||
      source === ReferralSource.NonDCINephrologist ||
      source === ReferralSource.ToBeDetermined
    ) {
      this.group.controls.unknownComment.enable();
    } else {
      this.group.controls.unknownComment.reset();
      this.group.controls.unknownComment.disable();
    }
  });

  referralGroups: ReferralGroup[] = [];

  isDCINephrologist = isDCINephrologist;

  ngOnInit(): void {
    const referrals: Referral[] = [];

    for(let i = 0; i < 100; i++) {
      const name = uniqueNamesGenerator({ dictionaries: [names], style: 'capital' });
      const location = `${Math.floor(Math.random()*90000) + 10000} - ${uniqueNamesGenerator({ dictionaries: [adjectives], style: 'capital' })} ${uniqueNamesGenerator({ dictionaries: [adjectives], style: 'capital' })}`;
      
      referrals.push({
        source: ReferralSource.DCINephrologist,
        value: {
          name,
          location
        }
      })
    }

    this.referralGroups.push({
      label: 'DCI-Affiliated Nephrologists',
      referrals: referrals.sort((a, b) => {
        if (isDCINephrologist(a.value)) {
          if (isDCINephrologist(b.value)) {
            return a.value.name.localeCompare(b.value.name);
          } else {
            return a.value.name.localeCompare(b.value);
          }
        } else {
          if (isDCINephrologist(b.value)) {
            return a.value.localeCompare(b.value.name); 
          } else {
            return a.value.localeCompare(b.value);
          }
        }
      })
    });

    this.referralGroups.push({
      label: 'Non-DCI Nephrologist',
      referrals: [
        {
          source: ReferralSource.Hospital,
          value: 'From a Hospital',
        },
        {
          source: ReferralSource.PracticeGroup,
          value: 'From a Practice Group',
        },
        {
          source: ReferralSource.NonDCINephrologist,
          value: 'Non-DCI Nephrologist',
        },
        {
          source: ReferralSource.ToBeDetermined,
          value: 'To Be Determined',
        },
      ],
    });

    this.group.controls.referral.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.referralValue.set(value));
  }
}
