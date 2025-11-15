// SignaturePad.tsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Signature from "react-native-signature-canvas";

type Props = {
  onOK: (dataUrl: string) => void;
  onEmpty?: () => void;
  penColor?: string;
  backgroundColor?: string;
  style?: any;
};

export type SignaturePadRef = {
  clear: () => void;
  read: () => void;
};

const SignaturePad = forwardRef<SignaturePadRef, Props>(
  (
    {
      onOK,
      onEmpty,
      penColor = "#111",
      backgroundColor = "transparent",
      style,
    },
    ref
  ) => {
    const sigRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      clear: () => sigRef.current?.clearSignature(),
      read: () => sigRef.current?.readSignature(),
    }));

    const webStyle = `
      .m-signature-pad {box-shadow: none; border: none;}
      .m-signature-pad--footer {display: none; margin: 0;}
      body,html {height:100%; background: transparent;}
    `;

    return (
      <View style={[styles.wrapper, style]}>
        <Signature
          ref={sigRef}
          onOK={(s: string) => onOK(s)}
          onEmpty={() => onEmpty?.()}
          webStyle={webStyle}
          descriptionText=""
          clearText="Clear"
          confirmText="Save"
          dotSize={1}
          dataURL={undefined}
          penColor={penColor}
          backgroundColor={backgroundColor}
          imageType="image/png"
          autoClear={false}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    height: 260,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
});

export default SignaturePad;
