import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const SessionExpired = ({ ...props }) => {

    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center align-items-center" {...props}>
            <h3>
            Your session expired. Please sign in again.
            </h3>
            <Button
                variant="light"
                onClick={() => {
                    navigate("/login");
                }}
            >
            Sign in
            </Button>
        </div>
    );
}