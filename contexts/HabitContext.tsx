import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface HabitProps {
  habitData: any;
  setHabitData: React.Dispatch<any>;
}

const HabitContext = createContext<{
  habitData: any;
  setHabitData: React.Dispatch<any>;
}>({
  habitData: {},
  setHabitData: () => {}, // No-op function
});

export default HabitContext;
