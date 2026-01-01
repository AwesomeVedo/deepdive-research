import { useLocation, useNavigate } from "react-router-dom";
import { logIn } from "../app/auth";

type LocationState = {
    from?: {
        pathname: string;
    };
};

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const from =
        (location.state as LocationState)?.from?.pathname || "/dashboard";

    return (
        <>
            <h1>DeepDive Research</h1>
            <button
                onClick={() => {
                    logIn();
                    navigate(from, { replace: true });
                }}
            >
                Log in
            </button>
        </>
    );
}
