import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthorizationForm, MyOffcanvas } from "../";
import { useAuth } from "../../hooks";
import { Home } from "./";

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