import { Button } from "react-bootstrap";
import { useTabulature } from "../hooks/useTabulature";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";



export const AddMeasureView = () => {

    const { addMeasure, globalNumerator, globalDenominator, globalTempo } = useTabulature();

    const { getToken } = useAuth();

    const navigate = useNavigate();

    const handleAddMeasure = async () => {
        const token = await getToken();
        if (!token) {
            navigate('/login');
            return;
        }
        addMeasure(globalTempo, globalNumerator, globalDenominator, token);
    }

    return (
       
        <div
            className="d-flex justify-content-center align-items-center column"
            style={{ height: "100%" }}  // + 1.5 ==> measure label
        >
            <Button
                variant="light"
                onClick={handleAddMeasure }
            >
                New Measure
            </Button>
        </div>
    );
}