// hooks/useAchievements.ts
import * as React from "react";
import {
  fetchAchievements,
  AchievementsResponse,
} from "@/services/achievementService";

type State =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: AchievementsResponse; error: null }
  | { status: "error"; data: null; error: Error };

export function useAchievements() {
  const [state, setState] = React.useState<State>({
    status: "idle",
    data: null,
    error: null,
  });

  const load = React.useCallback(async (signal?: AbortSignal) => {
    setState({ status: "loading", data: null, error: null });
    try {
      const data = await fetchAchievements(signal);
      setState({ status: "success", data, error: null });
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setState({ status: "error", data: null, error: e });
    }
  }, []);

  // 👇 fixed effect
  React.useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const refresh = React.useCallback(() => {
    const controller = new AbortController();
    load(controller.signal);
  }, [load]);

  return {
    loading: state.status === "loading",
    error: state.status === "error" ? state.error : null,
    data: state.status === "success" ? state.data : null,
    refresh,
  };
}
