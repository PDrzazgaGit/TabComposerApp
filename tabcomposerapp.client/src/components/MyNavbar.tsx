import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Form, InputGroup } from "react-bootstrap";
import { MyOffcanvas } from "./MyOffcanvas";
import { MyLoginForm } from "./MyLoginForm";

export const MyNavbar = () => {
    
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
                            <MyOffcanvas
                                title="Login"
                                trigger={<Nav.Link as={Link} to="/login">Sign in</Nav.Link>}
                                placement="end"
                                
                            >
                               <MyLoginForm/>
                            </MyOffcanvas>
                            
                        </Nav>

                    </Nav>

                    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};