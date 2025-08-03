import React from 'react';
import { RegistrationStep } from '../../types/auth';

interface StepperProps {
  steps: RegistrationStep[];
  className?: string;
}

export default function Stepper({ steps, className = '' }: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.stepNumber}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step.isCompleted
                    ? 'bg-[#340040] text-white'
                    : step.isActive
                    ? 'bg-[#340040] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.stepNumber
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  step.isActive || step.isCompleted ? 'text-[#340040]' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors ${
                  steps[index + 1].isCompleted || (step.isCompleted && steps[index + 1].isActive)
                    ? 'bg-[#340040]'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 