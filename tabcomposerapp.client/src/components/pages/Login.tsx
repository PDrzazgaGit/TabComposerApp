import { useState } from "react";
import { AuthorizationForm } from "../AuthorizationForm";
import { useNavigate } from "react-router-dom";
import { MyOffcanvas } from "../MyOffcanvas";
import { useAuth } from "../../hooks/useAuth";
import { Home } from "./Home";

export const Login = () => {

    const [loginHeader, setLoginHeader] = useState<string>();

    const navigate = useNavigate();

    const { user } = useAuth();

    const handleHide = () => {
        navigate("/");
    }

    if(user) navigate ("/mytabs")

    return (
        <>
            <MyOffcanvas
                alwaysShow
                title={loginHeader}
                handleClose={handleHide}
                placement="end"
            >
                <AuthorizationForm updateTitle={setLoginHeader} />
            </MyOffcanvas>
            <Home/>
        </>
    );
}