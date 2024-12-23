import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Account = () => {

    const { signOut } = useAuth();

    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate('/');
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <Button
                variant="danger"
                onClick={handleSignOut}

            >
                Sign Out
            </Button >
        </div>
    );

}