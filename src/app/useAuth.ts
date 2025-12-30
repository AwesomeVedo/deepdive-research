import { useEffect, useSyncExternalStore } from "react";
import { isLoggedIn, subscribeAuth } from "./auth";

export function useAuth() {
  const loggedIn = useSyncExternalStore(
    subscribeAuth,
    isLoggedIn,
    isLoggedIn
  );

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "dd_logged_in") {
        // trigger subscribers
        // easiest way: call subscribe listeners by invoking a noop login/logout?
        // but we don't want to change storage. So we rely on auth.ts notify.
        // We'll handle this cleanly in auth.ts next step if you want multi-tab.
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { loggedIn };
}
