import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Form, InputGroup, Button } from "react-bootstrap";
import { MyOffcanvas } from "./MyOffcanvas";
import { AuthorizationForm } from "./AuthorizationForm";
import {useAuth } from "./../context/AuthContext"



export const MyNavbar = () => {

    const { user, signOut } = useAuth();

    const [offcanvasTitle, setOffcanvasTitle] = useState<string>();

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
                                className="me-2"
                                aria-label="Search for Tabs"
                            />
                            <InputGroup.Text>
                                <i className="bi bi-search"></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form>

                    <Nav className="ms-auto d-flex align-items-center">

                        <Nav className="me-auto ">
                            <Nav.Link as={Link} to="/about">About</Nav.Link>
                            {user === null && (
                                <MyOffcanvas
                                    title={offcanvasTitle}
                                    trigger={<Nav.Link>Sign in</Nav.Link>}
                                    placement="end"
                                >
                                    <AuthorizationForm updateTitle={setOffcanvasTitle} />
                                </MyOffcanvas>
                            ) || user !== null && (
                                <MyOffcanvas
                                    title={"Hello " + user.username}
                                    trigger={<Nav.Link>My Account</Nav.Link>}
                                    placement="end"
                                >
                                    some manage account component
                                    <Button onClick={ signOut }>
                                        Sign Out
                                    </Button>
                                </MyOffcanvas>
                            )}
                           
                            
                        </Nav>

                    </Nav>
                    
                    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};