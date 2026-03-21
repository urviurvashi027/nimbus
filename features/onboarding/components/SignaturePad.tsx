// SignaturePad.tsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, StyleSheet } from "react-native";
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
      penColor = "#A3BE8C",
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
      html, body { height: 100%; background: transparent; }
      .m-signature-pad { box-shadow: none; border: none; }
      .m-signature-pad--body { border: none; }
      .m-signature-pad--footer { display: none !important; }
      canvas { background: transparent; }
    `;

    return (
      <View style={[styles.wrapper, { backgroundColor }, style]}>
        <Signature
          ref={sigRef}
          onOK={(s: string) => onOK(s)}
          onEmpty={() => onEmpty?.()}
          webStyle={webStyle}
          descriptionText=""
          dotSize={1}
          penColor={penColor}
          backgroundColor="transparent"
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
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
});

export default SignaturePad;
