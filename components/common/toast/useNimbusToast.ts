import Toast from "react-native-toast-message";

type Variant = "success" | "error" | "info" | "warning";

export function useNimbusToast() {
  return {
    show: (args: { variant: Variant; title: string; message?: string }) => {
      Toast.show({
        type: args.variant,
        text1: args.title,
        text2: args.message,
        position: "bottom",
      });
    },
    hide: () => Toast.hide(),
  };
}
