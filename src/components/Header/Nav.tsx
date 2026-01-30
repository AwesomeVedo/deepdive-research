import { NavLink, useNavigate } from "react-router-dom";
import { logOut } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";

export default function Nav() {
    const navigate = useNavigate();
    const { loggedIn } = useAuth();

    return (
        <nav style={{ display: "flex", gap: 32, padding: 16, alignItems: "center" }}>
            {/* <NavLink to="/">Home</NavLink> */}
            {loggedIn ? (
                <>
                    <NavLink to="/braindump">Braindump</NavLink>
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
