import { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

interface AuthorizationFormProps {
    updateTitle: (newTutle: string) => void;
}

export const AuthorizationForm: React.FC<AuthorizationFormProps> = ({ updateTitle }) => {

    const enum FormState {
        SIGNIN,
        SIGNUP,
        CHANGEPSWD
    }; 

    const [formState, setFormState] = useState<FormState>(FormState.SIGNIN);

    // Funkcja prze³¹czaj¹ca tryb
    const changeMode = (newState: FormState) => {
        setFormState(newState);
    };

    useEffect(() => {
        switch (formState) {
            case FormState.SIGNIN:
                updateTitle("Sign In to Tab Composer");
                break;
            case FormState.SIGNUP:
                updateTitle("Sign Up to Tab Composer");
                break;
            case FormState.CHANGEPSWD:
                updateTitle("Change Password");
                break;
            default:
                updateTitle("Welcome!");
        }
    });

    const renderEmailInput = () => (
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
                {formState === FormState.CHANGEPSWD
                    ? "Provide your email to change your password"
                    : "Email address"}
            </Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
    );

    const renderPasswordInput = () => (
        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
        </Form.Group>
    );

    const renderUsernameInput = () => (
        < Form.Group className = "mb-3" controlId = "formBasicUsername" >
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" />
        </Form.Group >
    );

    const renderForgotPasswordLink = () => (
        <Form.Group className="mb-3 d-flex justify-content-center align-items-center">
            Forgot your password?
            <Button variant="link" onClick={() => changeMode(FormState.CHANGEPSWD)}>
                Click here!
            </Button>
        </Form.Group>
    );

    const renderActions = () => {
        
        let buttonText: string = "";
        let buttonLinkText: string = "";
        let text: string = "";

        switch (formState) {
            case FormState.SIGNUP:
                buttonText = "Sign up";
                buttonLinkText = "Sign in";
                text = "Already registered?";
                break;

            case FormState.SIGNIN:
                buttonText = "Sign in";
                buttonLinkText = "Sign up";
                text = "New to TabComposer?";
                break;

            case FormState.CHANGEPSWD:
                buttonText = "Send";
                buttonLinkText = "Back";
                text = "Got your password?";
                break;

            default:

                return null;
        }

        return (
            <>
                <Button className="mb-3 w-100" variant="light" type="submit">
                    {buttonText}
                </Button>
                <Form.Group className="d-flex justify-content-center align-items-center">
                    {text}
                    <Button variant="link" onClick={() => changeMode(
                        formState === FormState.SIGNIN ? FormState.SIGNUP : FormState.SIGNIN
                    )}>
                        {buttonLinkText}
                    </Button>
                </Form.Group>
            </>
        );
    }

    return (
        <>
            {formState !== FormState.CHANGEPSWD && renderUsernameInput()}
            {formState !== FormState.SIGNIN && renderEmailInput()}
            {formState !== FormState.CHANGEPSWD && renderPasswordInput()}
            {formState === FormState.SIGNIN && renderForgotPasswordLink()}
            {renderActions()}
        </>
    );
};