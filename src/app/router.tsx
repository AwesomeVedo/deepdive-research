import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import { App } from "./App";
import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { routes } from "./routes";

function elementFor(path: string) {
    switch (path) {
        case "/":
            return <Home />;
        case "/about":
            return <About />;
        case "/login":
            return <Login />;
        case "/dashboard":
            return (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            );
        default:
            return <div>Not found</div>;
    }
}

const children: RouteObject[] = [
    { index: true, element: elementFor("/") },

    ...routes
        .filter((r) => r.path !== "/")
        .map((r) => ({
            path: r.path.replace(/^\//, ""), // "/about" -> "about"
            element: elementFor(r.path),
        })),
];

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            errorElement: (
                <div style={{ padding: 16 }}>
                    <h2>404</h2>
                    <p>Page not found</p>
                </div>
            ),
            children,
        },
    ],
    {
        basename: import.meta.env.BASE_URL,
    }
);

