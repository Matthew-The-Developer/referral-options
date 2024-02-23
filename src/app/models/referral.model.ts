export enum UnknownSource {
  Hospital,
  PracticeGroup,
  NonDCINephrologist,
  ToBeDetermined,
}

export interface UnknownReferral {
  source: UnknownSource;
  description: string;
}

export enum ReferralSource {
  DCINephrologist,
  Hospital,
  PracticeGroup,
  NonDCINephrologist,
  ToBeDetermined,
  UnknownSource,
}

export interface DCINephrologist {
  name: string;
  location: string;
}

export interface Referral {
  source: ReferralSource;
  value: string | DCINephrologist;
}

export interface ReferralGroup {
  label: string;
  referrals: Referral[];
}