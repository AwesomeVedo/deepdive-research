import { NavLink, useNavigate } from "react-router-dom";
import { logOut } from "../app/auth";
import { useAuth } from "../app/useAuth";

export default function Nav() {
    const navigate = useNavigate();
    const { loggedIn } = useAuth();

    return (
        <nav style={{ display: "flex", gap: 12, padding: 16, alignItems: "center" }}>
            <NavLink to="/">Home</NavLink>

            {loggedIn ? (
                <>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <button
                        onClick={() => {
                            logOut();
                            navigate("/login");
                        }}
                    >
                        Log out
                    </button>
                </>
            ) : (
                <NavLink to="/login">Login</NavLink>
            )}
        </nav>
    );
}
