import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface TabulatureContainer {
    children: React.ReactNode;
    maxItemsPerRow: number; // Maksymalna liczba komponentów w jednym wierszu
}

export const TabulatureContainer: React.FC<TabulatureContainer> = ({ children, maxItemsPerRow }) => {
    // Liczymy liczbê dzieci w komponencie A
    const childrenArray = React.Children.toArray(children);

    // Tworzymy wiersze w zale¿noœci od liczby komponentów B
    const rows: JSX.Element[] = [];
    let currentRow: JSX.Element[] = [];

    childrenArray.forEach((child, index) => {
        // Obliczamy szerokoœæ dla komponentu B w zale¿noœci od liczby komponentów w wierszu
        const width = `${(100 / Math.min(maxItemsPerRow, childrenArray.length)).toFixed(2)}%`;

        currentRow.push(
            <Col key={index} style={{ width, padding: '0' }}>
                {child}
            </Col>
        );

        // Je¿eli osi¹gniemy maksymaln¹ liczbê komponentów w wierszu, przechodzimy do nowego wiersza
        if (currentRow.length === maxItemsPerRow) {
            rows.push(<Row className="mb-3" key={index} >{currentRow}</Row>);
            currentRow = [];
        }
    });

    // Jeœli zosta³y komponenty w currentRow, dodajemy je do ostatniego wiersza
    if (currentRow.length > 0) {
        rows.push(<Row className="mb-3" key="last">{currentRow} </Row>);
    }

    return <Container className="">{rows}</Container>;
};