import { useNavigate, useLocation } from "react-router-dom";
import { logIn } from "../services/auth";

type LocationState = {
    from?: {
        pathname: string;
    };
};

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const from =
        (location.state as LocationState)?.from?.pathname || "/braindump";

    return (
        <>
            <div id="login-page">
                <h1>Headspace</h1>
                <p>Organize Your Mind.</p>
                <button
                    type="button"
                    className="login-button"
                    onClick={() => {
                        logIn();
                        navigate(from, { replace: true });
                    }}
                >Log in</button>
            </div>
        </>
    );
}
