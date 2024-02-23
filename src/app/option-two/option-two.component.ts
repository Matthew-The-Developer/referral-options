import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DCINephrologist, Referral, ReferralSource, UnknownReferral, UnknownSource } from '../models/referral.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-option-two',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './option-two.component.html',
  styleUrl: './option-two.component.scss'
})
export class OptionTwoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  
  group = this.fb.group({
    referral: new FormControl<Referral | null>(null, [Validators.required]),
    unknownSource: [{ value: null, disabled: true }, [Validators.required]],
    unknownComment: [{ value: '', disabled: true }],
  });

  referralValue = signal<Referral | null>(null);

  unknownCommentLabel = computed(() => {
    if (this.referralValue()?.source === ReferralSource.NonDCINephrologist) {
      return "Does the patient know the nephrologist's name?";
    } else {
      return 'Does the patient know more about the their referral?';
    }
  });

  referralisUnknown = effect(() => {
    if (this.referralValue()?.source === ReferralSource.UnknownSource) {
      this.group.controls.unknownComment.reset();
      this.group.controls.unknownSource.enable();
      this.group.controls.unknownComment.enable();
    } else if (
      this.referralValue()?.source === ReferralSource.NonDCINephrologist
    ) {
      this.group.controls.unknownSource.reset();
      this.group.controls.unknownComment.reset();
      this.group.controls.unknownSource.disable();
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
      source: UnknownSource.ToBeDetermined,
      description: 'To be determined',
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
