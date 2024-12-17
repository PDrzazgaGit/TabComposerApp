import { useState } from "react";
import { AuthorizationForm } from "../AuthorizationForm";
import { useNavigate } from "react-router-dom";
import { MyOffcanvas } from "../MyOffcanvas";

export const Login = () => {

    const [loginHeader, setLoginHeader] = useState<string>();

    const navigate = useNavigate();

    const handleHide = () => {
        navigate("/");
    }

    return (
        <MyOffcanvas
            alwaysShow
            title={loginHeader}
            handleClose={handleHide}
            placement="end"
        >
            <AuthorizationForm updateTitle={setLoginHeader} />
        </MyOffcanvas>
    );
}