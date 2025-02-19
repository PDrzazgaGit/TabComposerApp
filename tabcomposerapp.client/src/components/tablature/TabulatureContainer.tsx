import React from 'react';
import { Row, Col } from 'react-bootstrap';

interface TabulatureContainer {
    children: React.ReactNode;
    maxItemsPerRow: number; 
}

export const TabulatureContainer: React.FC<TabulatureContainer> = ({ children, maxItemsPerRow }) => {
    
    const childrenArray = React.Children.toArray(children);

    const rows: JSX.Element[] = [];
    let currentRow: JSX.Element[] = [];

    childrenArray.forEach((child, index) => {
       
        const width = `${(100 / Math.min(maxItemsPerRow, childrenArray.length)).toFixed(2)}%`;

        currentRow.push(
            <Col key={index} style={{ width, padding: '0' }}>
                {child}
            </Col>
        );

        if (currentRow.length === maxItemsPerRow) {
            rows.push(<Row key={index} className="mb-3 mx-0">{currentRow}</Row>);
            currentRow = [];
        }
    });

    if (currentRow.length > 0) {
        rows.push(<Row key="last" className="mb-3 mx-0">{currentRow} </Row>);
    }

    return <div>{rows}</div>;
};