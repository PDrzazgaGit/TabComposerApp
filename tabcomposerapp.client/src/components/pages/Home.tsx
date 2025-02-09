import { Container, Row, Col, Button, Image, Card } from "react-bootstrap";
import { TabCostFunction, TablaturePositionFinder } from "../../services/TablaturePositionFinder";
import { TuningFactory } from "../../services";
import { Metronome } from "../../services/audio/NotePutterService";

export const Home = () => {
    /*
    const finder = new TablaturePositionFinder(TuningFactory.EStandardTuning());
    finder.addSound(329.63);
    finder.addSound(349.23);
    finder.addSound(369.99);
    //finder.addSound(392.00);
    //finder.addSound(293.66);
    //finder.addSound(261.63);
    //finder.addSound(466.16);
    console.log(finder)

    const costFunction  = (fretA: number, stringA: number, fretB: number, stringB: number): number =>  {
        return 1 * Math.abs(fretB - fretA) + 3 * Math.abs(stringB - stringA) + 1;
    }

    console.log(finder.getBestPositions(costFunction))
    */

    return (
        <Container className="mt-5">
            {/* Nagłówek */}
            <Row className="justify-content-center">
                <Col md={10} className="text-center">
                    <h1 className="fw-bold">Welcome to TabComposer</h1>
                    <h5 className="text-muted">
                        A modern web-based guitar tablature editor with real-time sound analysis.
                    </h5>
                </Col>
            </Row>

            {/* Opis projektu */}
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

            {/* Jak działa aplikacja */}
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

                {/* Ilustracja działania */}
                <Col md={6} className="text-center">
                    <Image
                        src="public/homepagescreen.png"
                        alt="TabComposer screenshot"
                        fluid
                        className="shadow-lg rounded"
                    />
                </Col>
            </Row>

            {/* Zachęta do założenia konta */}
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
