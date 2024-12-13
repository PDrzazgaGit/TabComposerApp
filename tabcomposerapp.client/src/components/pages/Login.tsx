import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { AuthorizationForm } from "../AuthorizationForm";
import { useWindowSize } from "@react-hook/window-size";
import { useNavigate } from "react-router-dom";
import { MyOffcanvas } from "../MyOffcanvas";

export const Login = () => {

    //const [show, setShow] = useState<boolean>(true);
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