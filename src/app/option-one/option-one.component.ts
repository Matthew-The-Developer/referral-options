import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DCINephrologist, Referral, ReferralSource, UnknownReferral, UnknownSource, isDCINephrologist } from '../models/referral.model';

import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-option-one',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './option-one.component.html',
  styleUrl: './option-one.component.scss'
})
export class OptionOneComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  group = this.fb.group({
    referral: new FormControl<Referral | null>(null, [Validators.required]),
    unknownSource: [{ value: null, disabled: true }, [Validators.required]],
    unknownComment: [{ value: '', disabled: true }],
  });

  referralValue = signal<Referral | null>(null);
  referralisUnknown = effect(() => {
    if (this.referralValue()?.source === ReferralSource.UnknownSource) {
      this.group.controls.unknownSource.enable();
      this.group.controls.unknownComment.enable();
    } else {
      this.group.controls.unknownSource.reset();
      this.group.controls.unknownComment.reset();
      this.group.controls.unknownSource.disable();
      this.group.controls.unknownComment.disable();
    }
  });

  referralOptions: Referral[] = [
    {
      source: ReferralSource.UnknownSource,
      value: "I don't know",
    },
    {
      source: ReferralSource.NonDCINephrologist,
      value: 'Non-DCI Nephrologist',
    },
    {
      source: ReferralSource.DCINephrologist,
      value: {
        name: 'Dr. Dohn Joe',
        location: '00001 - Middle of Nowhere',
      },
    },
    {
      source: ReferralSource.DCINephrologist,
      value: {
        name: 'Dr. Who',
        location: '00002 - Space & Time',
      },
    },
    {
      source: ReferralSource.DCINephrologist,
      value: {
        name: 'Dr. Dohn Joe',
        location: '00001 - Middle of Nowhere',
      },
    },
  ];

  unknownOptions: UnknownReferral[] = [
    {
      source: UnknownSource.Hospital,
      description: 'From a hospital',
    },
    {
      source: UnknownSource.PracticeGroup,
      description: 'From a practice group',
    },
    {
      source: UnknownSource.NonDCINephrologist,
      description: 'From a non-DCI nephrologist',
    },
    {
      source: UnknownSource.ToBeDetermined,
      description: 'To be determined',
    },
  ];

  isDCINephrologist = isDCINephrologist;

  ngOnInit(): void {
    this.group.controls.referral.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.referralValue.set(value));
  }
}
