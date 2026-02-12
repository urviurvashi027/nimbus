import { createContext, useContext } from "react";

export type NimbusAlertVariant = "error" | "info" | "warning" | "success";

export type NimbusAlertAction = {
  label: string;
  onPress?: () => void; // if missing => just close
};

export type NimbusAlertPayload = {
  variant?: NimbusAlertVariant;
  title: string;
  message?: string;
  primary?: NimbusAlertAction;
  secondary?: NimbusAlertAction;
  dismissible?: boolean;
};

export type NimbusAlertApi = {
  show: (p: NimbusAlertPayload) => void;
  hide: () => void;
};

export const NimbusAlertContext = createContext<NimbusAlertApi | null>(null);

export function useNimbusAlert() {
  const ctx = useContext(NimbusAlertContext);
  if (!ctx)
    throw new Error("useNimbusAlert must be used within NimbusAlertProvider");
  return ctx;
}
