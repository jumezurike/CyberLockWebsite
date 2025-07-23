interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Inquiry & Questionnaire" },
    { number: 2, title: "Interview & Matrix Population" },
    { number: 3, title: "Preliminary Report" },
    { number: 4, title: "Comprehensive Report" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between">
      {steps.map((step) => {
        const isActive = currentStep >= step.number;
        const isCurrentStep = currentStep === step.number;
        
        return (
          <div key={step.number} className="flex flex-col items-center mb-4 md:mb-0">
            <div 
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold mb-2
                ${isActive 
                  ? isCurrentStep 
                    ? 'bg-chart-4 text-white' 
                    : 'bg-chart-4/20 text-chart-4'
                  : 'bg-neutral-200 text-neutral-500'}
              `}
            >
              {step.number}
            </div>
            <p className={isActive ? 'text-chart-4 font-medium' : 'text-neutral-500'}>
              {step.title}
            </p>
            {step.number < steps.length && (
              <div className="hidden md:block w-16 h-1 bg-neutral-200 absolute left-1/2 transform -translate-x-1/2">
                <div 
                  className="h-full bg-chart-4" 
                  style={{ width: isActive ? '100%' : '0%', transition: 'width 0.3s ease-in-out' }}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
