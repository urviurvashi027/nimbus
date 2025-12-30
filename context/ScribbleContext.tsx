// context/ScribbleContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Scribble, scribbleService } from "@/services/scribbleService";

interface ScribbleContextType {
  scribbles: Scribble[];
  loading: boolean;
  addScribble: (scribble: Omit<Scribble, "id" | "date">) => Promise<void>;
  refreshScribbles: () => Promise<void>;
}

const ScribbleContext = createContext<ScribbleContextType | undefined>(undefined);

export const ScribbleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scribbles, setScribbles] = useState<Scribble[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshScribbles = async () => {
    setLoading(true);
    const data = await scribbleService.getScribbles();
    setScribbles(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshScribbles();
  }, []);

  const addScribble = async (newScribble: Omit<Scribble, "id" | "date">) => {
    const saved = await scribbleService.saveScribble(newScribble);
    setScribbles((prev) => [saved, ...prev]);
  };

  return (
    <ScribbleContext.Provider value={{ scribbles, loading, addScribble, refreshScribbles }}>
      {children}
    </ScribbleContext.Provider>
  );
};

export const useScribbles = () => {
  const context = useContext(ScribbleContext);
  if (!context) {
    throw new Error("useScribbles must be used within a ScribbleProvider");
  }
  return context;
};
