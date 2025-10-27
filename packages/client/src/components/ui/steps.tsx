import { cn } from '../../lib/utils';
import React from 'react';

type Step = {
  label: string;
  description?: string;
}

type StepsProps = {
  steps: Step[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                `flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors`,
                currentStep >= index + 1 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600'
              )}
            >
              {index + 1}
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  `font-medium`,
                  currentStep >= index + 1 ? 'text-rose-500' : 'text-zinc-300'
                )}
              >
                {step.label}
              </span>
              {step.description && (
                <span className="text-xs text-gray-400">{step.description}</span>
              )}
            </div>
          </div>

          {index < steps.length - 1 && (
            <div className="flex-1 min-w-[80px] h-1 bg-zinc-200 mx-4">
              <div
                className={cn(
                  `h-full transition-all duration-300`,
                  currentStep >= index + 2 ? 'bg-rose-500 w-full' : 'w-0'
                )}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}