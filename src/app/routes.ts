export type AppRoute = {
    path: string;
    label: string;
    showInNav: boolean;
    requiresAuth?: boolean;
  };
  
  export const routes: AppRoute[] = [
    { path: "/", label: "Home", showInNav: true },
    { path: "/about", label: "About", showInNav: true },
    { path: "/dashboard", label: "Dashboard", showInNav: true, requiresAuth: true },
    { path: "/login", label: "Login", showInNav: false }, // Nav will show it conditionally
  ];
  