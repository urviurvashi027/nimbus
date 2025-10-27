// // context/ReminderContext.tsx
// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import {
//   ReminderSettings,
//   getReminder,
//   saveReminder,
//   removeReminder,
//   getUserProfileInfo,
// } from "@/services/remiderStorageService";
// import * as SecureStore from "expo-secure-store";

// type ReminderMap = Record<string, ReminderSettings | null>;

// type ReminderContextType = {
//   loading: boolean;
//   reminders: ReminderMap;
//   get: (type: string) => Promise<any>;
//   save: (payload: any) => Promise<any>;
//   remove: (type: string) => Promise<void>;
//   refreshAll: () => Promise<void>;
//   getUserProfile: () => Promise<any>;
// };

// const ReminderContext = createContext<ReminderContextType | undefined>(
//   undefined
// );

// export const useReminder = () => {
//   const ctx = useContext(ReminderContext);
//   if (!ctx) throw new Error("useReminder must be used within ReminderProvider");
//   return ctx;
// };

// export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   // reminders is a keyed object, not an array
//   const [reminders, setReminders] = useState<ReminderMap>({});
//   const [loading, setLoading] = useState(true);

//   // known keys you expect (optional)
//   const types = useMemo(
//     () => ["morning_review", "night_review", "mood_logger", "streak_saver"],
//     []
//   );

//   const refreshAll = useCallback(async () => {
//     setLoading(true);
//     try {
//       // getReminder returns a keyed map (NotificationsByType) or defaults merged map
//       const next = await getReminder();
//       // ensure we always set an object (empty object fallback)
//       setReminders((prev) => {
//         // next might be NotificationsByType (Record<string, {enabled,time,...}>)
//         // but shape may differ from ReminderSettings; we store as-is (any) or attempt to cast
//         return (next as unknown as ReminderMap) ?? {};
//       });
//     } catch (e) {
//       console.warn("refreshAll error", e);
//       setReminders({});
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // load all on mount (optional)
//   useEffect(() => {
//     refreshAll();
//   }, [refreshAll]);

//   // useEffect(() => {
//   //   console.log(reminders, "reminders");
//   // }, [reminders]);

//   // get single type - read from keyed map returned by service
//   const get = useCallback(async (type: string) => {
//     try {
//       // call service and read the specific key
//       const map = await getReminder();
//       const val = (map && (map as any)[type]) ?? null;
//       // keep reminders state in sync for convenience
//       setReminders((s) => ({ ...s, [type]: val }));
//       // console.log("get reminderii", type, val, map);
//       return map;
//     } catch (e) {
//       console.warn("get reminder error", e);
//       return null;
//     }
//   }, []);

//   const save = useCallback(async (payload: any) => {
//     try {
//       const response = await saveReminder(payload);
//       const { success, message, data } = response;
//       // console.log(response, "response auth context");
//       if (success && "email" in data) {
//         // console.log(response, "conimg response auth context 2222");
//         const {
//           username,
//           email,
//           first_name,
//           id,
//           last_name,
//           profile,
//           settings,
//           notifications,
//           ...tokens
//         } = data;
//         const usr = {
//           id: id,
//           username: username,
//           email: email,
//           first_name: first_name,
//           last_name: last_name,
//           profile: profile,
//           settings: settings,
//           notifications: notifications,
//         };

//         //  const profileInfo = await SecureStore.getItem("user-profile");
//         await SecureStore.setItemAsync("user-profile", JSON.stringify(usr));
//         return response;
//       }

//       // console.log(saved, "from save reminder");
//       // saveReminder currently returns the saved payload (you can adapt if your service returns different)
//       // setReminders((s) => ({ ...s, [type]: saved }));
//     } catch (e) {
//       console.warn("save reminder error", e);
//       throw e;
//     }
//   }, []);

//   const remove = useCallback(async (type: string) => {
//     try {
//       await removeReminder(type);
//       setReminders((s) => ({ ...s, [type]: null }));
//     } catch (e) {
//       console.warn("remove reminder error", e);
//       throw e;
//     }
//   }, []);

//   const getUserProfile = async () => {
//     try {
//       const r = await getUserProfileInfo();
//       if (!r) return null;
//       const parsed = JSON.parse(r);
//       return parsed;
//     } catch (e) {
//       console.warn("getUserProfile error", e);
//       return null;
//     }
//   };

//   return (
//     <ReminderContext.Provider
//       value={{
//         loading,
//         reminders,
//         get,
//         save,
//         remove,
//         refreshAll,
//         getUserProfile,
//       }}
//     >
//       {children}
//     </ReminderContext.Provider>
//   );
// };
