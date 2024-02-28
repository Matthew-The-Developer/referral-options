import { Component, DestroyRef, OnInit, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Referral, ReferralGroup, ReferralSource, displayReferral, isDCINephrologist } from '../models/referral.model';
import { adjectives, names, uniqueNamesGenerator } from 'unique-names-generator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { filter } from 'rxjs';

@Component({
  selector: 'app-option-six',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './option-six.component.html',
  styleUrl: './option-six.component.scss'
})
export class OptionSixComponent implements OnInit {
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

  nonDciNephrologistsGroup: ReferralGroup = {
    label: 'Non-DCI Nephrologist / Other',
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
  }

  referrals: Referral[] = Array.from(Array(100).keys()).map(() => {
    const name = uniqueNamesGenerator({ dictionaries: [names], style: 'capital' });
    const location = `${Math.floor(Math.random()*90000) + 10000} - ${uniqueNamesGenerator({ dictionaries: [adjectives], style: 'capital' })} ${uniqueNamesGenerator({ dictionaries: [adjectives], style: 'capital' })}`;

    return {
      source: ReferralSource.DCINephrologist,
      value: {
        name,
        location
      }
    } as Referral;
  }).sort((a, b) => {
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
  });
  
  private _filteredReferrals = signal<Referral[]>([]);
  filteredReferrals = this._filteredReferrals.asReadonly();

  isDCINephrologist = isDCINephrologist;
  displayReferral = displayReferral;

  ngOnInit(): void {
    this._filteredReferrals.set(this.referrals);
    this.group.controls.referral.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.referralValue.set(value));
  }

  

  filter(input: HTMLInputElement): void {
    const search = input.value.toLowerCase();
    this._filteredReferrals.set(this.referrals.filter(ref => {
      if (isDCINephrologist(ref.value)) {
        return ref.value.name.toLowerCase().includes(search);
      } else {
        return ref.value.toLowerCase().includes(search);
      }
    }))
  }
}
