import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface HabitProps {
  habitData: any;
  setHabitData: React.Dispatch<any>;
}

// const HabitContext = createContext<HabitProps>({
//   habitData: {},
//   setHabitData: () => {}, // No-op function
// });

// export const useHabit = () => useContext(HabitContext);

// export const HabitProvider = ({ children }: any) => {
//   const [habitState, setHabitState] = useState<any>({});

//   const value = {
//     habitData: habitState,
//     setHabitData: setHabitState,
//   };

//   return (
//     <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
//   );
// };

const HabitContext = createContext<{
  habitData: any;
  setHabitData: React.Dispatch<any>;
}>({
  habitData: {},
  setHabitData: () => {}, // No-op function
});

export default HabitContext;
