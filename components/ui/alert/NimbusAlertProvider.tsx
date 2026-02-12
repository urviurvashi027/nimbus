import React, { useMemo, useState } from "react";
import NimbusAlert from "./NimbusAlert";
import {
  NimbusAlertContext,
  NimbusAlertApi,
  NimbusAlertPayload,
} from "./useNimbusAlert";

export function NimbusAlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState<NimbusAlertPayload | null>(null);

  const api = useMemo<NimbusAlertApi>(
    () => ({
      show: (p) => {
        setPayload({
          dismissible: true,
          variant: "info",
          primary: { label: "OK" },
          ...p,
        });
        setVisible(true);
      },
      hide: () => {
        setVisible(false);
        setTimeout(() => setPayload(null), 120);
      },
    }),
    []
  );

  return (
    <NimbusAlertContext.Provider value={api}>
      {children}
      <NimbusAlert visible={visible} payload={payload} onClose={api.hide} />
    </NimbusAlertContext.Provider>
  );
}
