import React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep, 
  className 
}) => {

  return (
    <div className={cn("w-full", className)}>
      {/* Stepper Visual */}
      <nav className="flex items-center justify-center mb-8">
        <ol className="flex items-center space-x-8">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <li key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2",
                      {
                        "bg-blue-600 border-blue-600 text-white": isCompleted || isCurrent,
                        "border-gray-300 bg-white text-gray-500": !isCompleted && !isCurrent,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        {
                          "text-blue-600": isCompleted || isCurrent,
                          "text-gray-500": !isCompleted && !isCurrent,
                        }
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-sm text-gray-500">{step.description}</p>
                    )}
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 h-0.5 ml-4",
                      {
                        "bg-blue-600": currentStep > step.id,
                        "bg-gray-300": currentStep <= step.id,
                      }
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

// Componente separado para los botones de navegación
interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  nextButtonText?: string;
  previousButtonText?: string;
  nextButtonDisabled?: boolean;
}

export const StepperNavigation: React.FC<StepperNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  nextButtonText,
  previousButtonText,
  nextButtonDisabled = false,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    if (!isLastStep && onNext) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep && onPrevious) {
      onPrevious();
    }
  };

  return (
    <div className="flex justify-between items-center mt-6 border-gray-200">
      <div>
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {previousButtonText}
          </Button>
        )}
      </div>

      <div>
        {!isLastStep && currentStep !== 1 && (
          <Button
            onClick={handleNext}
            disabled={nextButtonDisabled}
            className="flex items-center gap-2"
          >
            {nextButtonText}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Stepper;
