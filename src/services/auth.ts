const KEY = "dd_logged_in";

const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) fn();
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(KEY) === "true";
}

export function logIn(): void {
  localStorage.setItem(KEY, "true");
  notify();
}

export function logOut(): void {
  localStorage.removeItem(KEY);
  notify();
}

// Allow React components to re-render when auth changes
export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
