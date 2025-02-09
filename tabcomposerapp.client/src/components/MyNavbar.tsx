import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "./../hooks/useAuth"
import { CreateTabulature } from "./tablature/CreateTabulature";



export const MyNavbar = () => {

    const { user, signOut } = useAuth();

    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate('/');
    }

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>
                    <Nav.Link as={Link} to="/">TabComposer</Nav.Link>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                
                <Navbar.Collapse className="mt-2 mb-2"  id="responsive-navbar-nav">

                    <Nav className="d-flex ms-auto align-items-center">

                        {user != null && user != undefined && (
                            <>
                                <CreateTabulature navlink={true}></CreateTabulature>
                                <Nav.Link as={Link} to="/mytabs">My Tabs</Nav.Link>
                                <Nav.Link onClick={ ()=>handleSignOut()}>Sign out</Nav.Link>
                            </>

                        )}
                        {user == null && (
                            <>
                                <Nav.Link as={Link} to="/tryeditor">Try Editor</Nav.Link>
                                <Nav.Link as={Link} to="/login">Sign in</Nav.Link>
                            </>
                        )}

                    </Nav>  
                    
                </Navbar.Collapse>
                
            </Container>
        </Navbar>
    );
};