import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Component, DestroyRef, OnInit, effect, inject, signal } from '@angular/core';
import { DCINephrologist, Referral, ReferralGroup, ReferralSource } from '../models/referral.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-option-three',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './option-three.component.html',
  styleUrl: './option-three.component.scss'
})
export class OptionThreeComponent implements OnInit {
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

  referralGroups: ReferralGroup[] = [
    {
      label: 'Outside of DCI',
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
    },
    {
      label: 'Inside of DCI',
      referrals: [
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
      ],
    },
  ];

  ngOnInit(): void {
    this.group.controls.referral.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.referralValue.set(value));
  }

  isDCINephrologist(value: string | DCINephrologist): value is DCINephrologist {
    return typeof value === 'object' && 'name' in value && 'location' in value;
  }
}
