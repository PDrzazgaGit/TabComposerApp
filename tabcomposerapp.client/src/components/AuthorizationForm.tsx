import { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';

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

    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);

    const { signIn, signUp, errors, clearErrors } = useAuth(); 

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        switch (formState) {
            case FormState.SIGNUP: {
                const success = await signUp(email, username, password);
                if (success) {
                    navigate("/");
                }
                break;
            }
            case FormState.SIGNIN: {
                const success = await signIn(username, password, remember);
                if (success) {
                    navigate("/");
                }
                break;
            }
            case FormState.CHANGEPSWD:
                // TODO
                break;
        }
    };

    // Funkcja prze³¹czaj¹ca tryb
    const changeMode = (newState: FormState) => {
        clearErrors();
        setFormState(newState);
        setEmail("");
        setPassword("");
        setUsername("");
    };

    useEffect(() => {
        switch (formState) {
            case FormState.SIGNIN:
                updateTitle("Sign In");
                break;
            case FormState.SIGNUP:
                updateTitle("Sign Up");
                break;
            case FormState.CHANGEPSWD:
                updateTitle("Change Password");
                break;
        }
    }, [FormState.CHANGEPSWD, FormState.SIGNIN, FormState.SIGNUP, formState, updateTitle]);

    const renderEmailInput = () => (
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
                {formState === FormState.CHANGEPSWD
                    ? "Provide your email to change your password"
                    : "Email address"}
            </Form.Label>
            <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={errors.email && errors.email.length > 0}
            />
            <Form.Control.Feedback type="invalid">
                {errors.email && errors.email.map((error, index) => (
                    <div key={index}>{error}</div>
                ))}
            </Form.Control.Feedback>
        </Form.Group>
    );


    const renderPasswordInput = () => (
        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={errors.password && errors.password.length > 0}
            />
            <Form.Control.Feedback type="invalid">
                {errors.password && errors.password.map((error, index) => (
                    <div key={index}>{error}</div>
                ))}
            </Form.Control.Feedback>
        </Form.Group>
    );

    const renderRememberMeCheckBox = () => (
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
                type="checkbox"
                label="Remember me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
            />
        </Form.Group>
    );

    const renderUsernameInput = () => (
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                isInvalid={errors.username && errors.username.length > 0}
            />
            <Form.Control.Feedback type="invalid">

                {errors.username && errors.username.map((error, index) => (
                    <div key={index}>{error}</div>
                ))}
            </Form.Control.Feedback>
        </Form.Group>
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
                
                <Form.Group className="mb-3 d-flex justify-content-center align-items-center">
                    {text}
                    <Button variant="link" onClick={() => changeMode(
                        formState === FormState.SIGNIN ? FormState.SIGNUP : FormState.SIGNIN
                    )}>
                        {buttonLinkText}
                    </Button>  
                </Form.Group>
                <Form.Group className="mb-3">
                    {errors.message && errors.message.map((error, index) => (
                        <div className="alert alert-danger text-center" role="alert" key={index}>{error}</div>
                    ))}
                </Form.Group>
            </>
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            {formState !== FormState.CHANGEPSWD && renderUsernameInput()}
            {formState !== FormState.SIGNIN && renderEmailInput()}
            {formState !== FormState.CHANGEPSWD && renderPasswordInput()}
            {formState === FormState.SIGNIN && renderRememberMeCheckBox()}
            {formState === FormState.SIGNIN && renderForgotPasswordLink()}
            {renderActions()}
        </Form>
    );
};