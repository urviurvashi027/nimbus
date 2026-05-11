import { useCallback, useMemo } from "react";
import Toast from "react-native-toast-message";

type Variant = "success" | "error" | "info" | "warning";

export function useNimbusToast() {
  const show = useCallback(
    (args: { variant: Variant; title: string; message?: string }) => {
      Toast.show({
        type: args.variant,
        text1: args.title,
        text2: args.message,
        position: "bottom",
      });
    },
    []
  );

  const hide = useCallback(() => Toast.hide(), []);

  return useMemo(
    () => ({
      show,
      hide,
    }),
    [hide, show]
  );
}
