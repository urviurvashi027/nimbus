import { createContext, useContext, useState } from "react";

export interface OnboardingData {
  dynamicAnswers: {
    [questionId: string]: string;
  };
  age?: string;
  gender?: string;
  height?: string;
  weight?: string;
}

interface ContextType {
  onboardingData: OnboardingData;
  setDynamicAnswer: (id: string, answer: string) => void;
  setProfileInfo: (
    info: Partial<Omit<OnboardingData, "dynamicAnswers">>
  ) => void;
  resetOnboardingData: () => void;
}

const OnboardingContext = createContext<ContextType | undefined>(undefined);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    dynamicAnswers: {},
  });

  const setDynamicAnswer = (id: string, answer: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      dynamicAnswers: {
        ...prev.dynamicAnswers,
        [id]: answer,
      },
    }));
  };

  const setProfileInfo = (
    info: Partial<Omit<OnboardingData, "dynamicAnswers">>
  ) => {
    setOnboardingData((prev) => ({
      ...prev,
      ...info,
    }));
  };

  const resetOnboardingData = () => setOnboardingData({ dynamicAnswers: {} });

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        setDynamicAnswer,
        setProfileInfo,
        resetOnboardingData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};
