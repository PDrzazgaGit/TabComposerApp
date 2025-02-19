import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";

export const Home = () => {

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={10} className="text-center">
                    <h1 className="fw-bold">Welcome to TabComposer</h1>
                    <h5 className="text-muted">
                        A modern web-based guitar tablature editor with real-time sound analysis.
                    </h5>
                </Col>
            </Row>

            <Row className="justify-content-center mt-4">
                <Col md={10} className="w-100">
                    <Card className="p-4 bg-light shadow-sm">
                        <Card.Body>
                            <h4 className="fw-semibold text-center">About the Project</h4>
                            <p className="fs-5 text-justify">
                                TabComposer is being developed as part of the engineering project
                                <strong> "Aiding Guitar Tablature Composition Through Instrument Sound Analysis"</strong>.
                                The application is designed to streamline the process of creating, editing,
                                and playing guitar tablatures, offering an intuitive and interactive experience
                                for musicians of all levels.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col md={6}>
                    <Card className="p-4 bg-light shadow-sm h-100">
                        <Card.Body>
                            <h4 className="fw-semibold text-center">How It Works</h4>
                            <ul className="fs-5 text-justify">
                                <li>🎸 Create and edit tablatures with an interactive editor.</li>
                                <li>🎵 Play and fine-tune your compositions.</li>
                                <li>🎤 Convert guitar sound into notes with real-time analysis.</li>
                                <li>💾 Securely save your tabs and access them anytime.</li>
                                <li>📊 Visualize sound with amplitude and frequency spectrum charts.</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="text-center">
                    <Image
                        src="src/assets/homepagescreen.png"
                        alt="TabComposer screenshot"
                        fluid
                        className="shadow-lg rounded"
                    />
                </Col>
            </Row>

            <Row className="justify-content-center mt-5 mb-5">
                <Col md={10} className="w-100">
                    <Card className="p-4 bg-light shadow-sm">
                        <Card.Body className="text-center">
                            <h4 className="fw-semibold">Start Creating Today</h4>
                            <p className="fs-5 text-justify">
                                Sign up now and explore the full power of TabComposer.
                                Experience seamless tablature creation and real-time sound analysis
                                to enhance your music composition workflow.
                            </p>
                            <Button variant="success" size="lg" href="/login">
                                Create an Account
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
