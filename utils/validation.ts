import { FormErrors } from '../types/auth';

// Email validation
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

// Password validation
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return undefined;
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return undefined;
};

// Phone number validation
export const validatePhoneNumber = (phoneNumber: string): string | undefined => {
  if (!phoneNumber) {
    return 'Phone number is required';
  }
  // Remove any non-digit characters for validation
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return 'Please enter a valid phone number';
  }
  return undefined;
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return undefined;
};

// Numeric field validation
export const validateNumeric = (value: string, fieldName: string): string | undefined => {
  if (!value) {
    return `${fieldName} is required`;
  }
  if (!/^\d+$/.test(value)) {
    return `${fieldName} must contain only numbers`;
  }
  return undefined;
};

// CR Number validation (Saudi Arabia)
export const validateCRNumber = (crNumber: string): string | undefined => {
  if (!crNumber) {
    return 'CR Number is required';
  }
  if (!/^\d{10}$/.test(crNumber)) {
    return 'CR Number must be exactly 10 digits';
  }
  return undefined;
};

// VAT Registration Number validation
export const validateVATNumber = (vatNumber: string): string | undefined => {
  if (!vatNumber) {
    return 'VAT Registration Number is required';
  }
  if (!/^\d{15}$/.test(vatNumber)) {
    return 'VAT Registration Number must be exactly 15 digits';
  }
  return undefined;
};

// Date validation for birthdate
export const validateBirthdate = (birthdate: string): string | undefined => {
  if (!birthdate) {
    return 'Birthdate is required';
  }
  
  const date = new Date(birthdate);
  const today = new Date();
  const minAge = 13; // Minimum age requirement
  const maxAge = 120; // Maximum reasonable age
  
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    // Adjust age if birthday hasn't occurred this year
  }
  
  if (age < minAge) {
    return `You must be at least ${minAge} years old`;
  }
  
  if (age > maxAge) {
    return 'Please enter a valid birthdate';
  }
  
  if (date > today) {
    return 'Birthdate cannot be in the future';
  }
  
  return undefined;
};

// Full name validation
export const validateFullName = (fullName: string): string | undefined => {
  if (!fullName.trim()) {
    return 'Full name is required';
  }
  if (fullName.trim().length < 2) {
    return 'Full name must be at least 2 characters long';
  }
  if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(fullName)) {
    return 'Full name can only contain letters and spaces';
  }
  return undefined;
};

// Commercial/Company name validation
export const validateCompanyName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'Company name is required';
  }
  if (name.trim().length < 2) {
    return 'Company name must be at least 2 characters long';
  }
  return undefined;
};

// Generic form validation function
export const validateForm = (data: any, validators: { [key: string]: (value: any) => string | undefined }): FormErrors => {
  const errors: FormErrors = {};
  
  Object.keys(validators).forEach(field => {
    const validator = validators[field];
    const error = validator(data[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
}; 