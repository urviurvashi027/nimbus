import { useState } from "react";

export function useOnboardingStep(totalSteps: number) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return { step, next, back };
}
