
export type ViewState = 'dashboard' | 'kuwait' | 'saudi' | 'jordan' | 'all' | 'help' | 'contact';

export interface BaseFormData {
  fullName: string;
  religion: string;
  dob: string;
  age: string;
  pob: string;
  maritalStatus: string;
  children: string;
  passportNumber: string;
  issueDate: string;
  placeOfIssue: string;
  expiryDate: string;
  
  // Employment 1
  hasExperience: boolean;
  expCountry: string;
  expPeriod: string;
  expPosition: string;

  // Employment 2 (New)
  expCountry2: string;
  expPeriod2: string;
  expPosition2: string;

  englishLevel: string;
  arabicLevel: string;
  photos: {
    face: string | null;
    full: string | null;
    passport: string | null;
  };
}

export interface KuwaitFormData extends BaseFormData {
  refNo: string;
  salary: string;
  printDate: string; // New Date field for Fahad
  height: string;
  weight: string;
  contactPerson: string;
  contactPhone: string;
  skills: {
    cooking: boolean;
    babySitting: boolean;
    cleaning: boolean;
    washing: boolean;
  };
}

export interface SaudiFormData extends BaseFormData {
  refNo: string;
  education: string;
  appliedFor: string;
  monthlySalary: string;
  contactPerson: string;
  relationship: string;
  contactPhone: string;
  address: string;
  height: string;
  weight: string;
  skills: {
    washing: boolean;
    cleaning: boolean;
    ironing: boolean;
    sewing: boolean;
    cooking: boolean;
    babyCare: boolean;
  };
}

export interface JordanFormData extends BaseFormData {
  refNo: string;
  weight: string;
  height: string;
  education: string;
  office: 'ewan' | 'option' | 'injaz';
  skills: {
    babySitting: boolean;
    cleaning: boolean;
    cooking: boolean;
  };
}

export interface AllFormData extends BaseFormData {
  refNo: string; // Default/Fallback ref
  // Specific Refs for the 6 PDFs
  refAlnoor: string;
  refFahad: string;
  refAldhahran: string;
  refEwan: string;
  refOption: string;
  refInjaz: string;
  
  printDate: string; // For Fahad

  education: string;
  weight: string;
  height: string;
  appliedFor: string;
  monthlySalary: string;
  contactPerson: string;
  relationship: string;
  contactPhone: string;
  address: string;
  skills: {
    cooking: boolean;
    babySitting: boolean;
    cleaning: boolean;
    washing: boolean;
    ironing: boolean;
    sewing: boolean;
  };
}

export interface PhotoState {
  face: string | null;
  full: string | null;
  pass: string | null;
}
