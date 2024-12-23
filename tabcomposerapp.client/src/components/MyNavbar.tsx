import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Form, InputGroup } from "react-bootstrap";
import { MyOffcanvas } from "./MyOffcanvas";
import { useAuth } from "./../hooks/useAuth"
import { Account } from "./Account";
import { CreateTabulature } from "./tablature/CreateTabulature";



export const MyNavbar = () => {

    const { authorize, user } = useAuth();

    useEffect(() => {
        const fetchAuthorize = async () => {
            await authorize();
        }
        fetchAuthorize();
    }, [user, authorize])

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>
                    <Nav.Link as={Link} to="/">TabComposer</Nav.Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse className="mt-2 mb-2"  id="responsive-navbar-nav">

                    <Form className="ms-auto d-flex">
                        <InputGroup>
                            <Form.Control
                                type="search"
                                placeholder="Search for Tabs"
                                aria-label="Search for Tabs"
                            />
                            <InputGroup.Text>
                                <i className="bi bi-search"></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form>

                    <Nav className="ms-auto d-flex align-items-center">

                        <Nav className="me-auto ">
                            
                            {user && (
                                <>
                                    <CreateTabulature navlink={true}></CreateTabulature>
                                    <Nav.Link as={Link} to="/mytabs">My Tabs</Nav.Link>
                                    <MyOffcanvas
                                        title={"Hello " + user?.username || ""}
                                        trigger={<Nav.Link>Account</Nav.Link>}
                                        placement="end"
                                    >
                                        <Account />
                                    </MyOffcanvas>
                                </>

                            ) || (
                                    <>
                                        <Nav.Link as={Link} to="/editor">Try Editor</Nav.Link>
                                        <Nav.Link as={Link} to="/login">Sign in</Nav.Link>

                                    </>
                                )
                            }

                        </Nav>

                    </Nav>
                    
                    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};