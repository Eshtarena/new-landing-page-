// Authentication form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface PersonalRegistrationStep1 {
  fullName: string;
  email: string;
  phoneNumber: string;
  birthdate: string;
}

export interface PersonalRegistrationStep2 {
  password: string;
  confirmPassword: string;
}

export interface OrganizationRegistrationStep1 {
  commercialName: string;
  registeredName: string;
  email: string;
  scopeOfBusiness: string;
}

export interface OrganizationRegistrationStep2 {
  crNumber: string;
  vatRegistrationNumber: string;
}

export interface OrganizationRegistrationStep3 {
  password: string;
  confirmPassword: string;
}

// Combined registration data types
export interface PersonalRegistrationData extends PersonalRegistrationStep1, PersonalRegistrationStep2 {}

export interface OrganizationRegistrationData 
  extends OrganizationRegistrationStep1, 
          OrganizationRegistrationStep2, 
          OrganizationRegistrationStep3 {}

// Account types
export type AccountType = 'personal' | 'organization';

// Registration step types
export interface RegistrationStep {
  stepNumber: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Form validation error types
export interface FormErrors {
  [key: string]: string | undefined;
}

// User creation interface
export interface User {
  id: string;
  email: string;
  accountType: AccountType;
  // Personal account fields
  fullName?: string;
  phoneNumber?: string;
  birthdate?: string;
  // Organization account fields
  commercialName?: string;
  registeredName?: string;
  scopeOfBusiness?: string;
  crNumber?: string;
  vatRegistrationNumber?: string;
  createdAt: Date;
  updatedAt: Date;
} 