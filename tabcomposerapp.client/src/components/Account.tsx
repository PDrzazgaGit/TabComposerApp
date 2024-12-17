import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export const Account = () => {

    const { signOut, user } = useAuth();

    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate('/');
    }

    useEffect(() => {

    });

    return (
        <div className="d-flex justify-content-center align-items-center">
            <Button
                variant="light"
                onClick={handleSignOut}

            >
                Sign Out
            </Button >
        </div>
    );

}