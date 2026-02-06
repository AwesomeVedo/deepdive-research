import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logOut, logIn } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";

type LocationState = {
    from?: {
        pathname: string;
    };
};

export function Nav() {
    const navigate = useNavigate();
    const { loggedIn } = useAuth();
    const location = useLocation();

    const from =
        (location.state as LocationState)?.from?.pathname || "/dashboard";

    return (
        <nav style={{ display: "flex", gap: 32, padding: 0, alignItems: "center" }}>
            {/* <NavLink to="/">Home</NavLink> */}
            {loggedIn ? (
                <>
                    <NavLink to="/braindump">Braindump</NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <button
                        type="button"
                        className="logout-button"
                        onClick={() => {
                            logOut();
                            navigate("/login");
                        }}
                    >
                        Log out
                    </button>
                </>
            ) : (
                <button
                    type="button"
                    className="login-button"
                    onClick={() => {
                        logIn();
                        navigate(from, { replace: true });
                    }}
                >Log in</button>
            )}
        </nav>
    );
}
