import { FC, ReactNode, useState } from 'react';
import Offcanvas, { OffcanvasProps } from 'react-bootstrap/Offcanvas';
import { useWindowSize } from '@react-hook/window-size';  // Hook do wykrywania rozmiaru okna

interface MyOffcanvasProps extends OffcanvasProps {
    trigger?: ReactNode;
    title?: string;
    children: ReactNode;
}

export const MyOffcanvas: FC<MyOffcanvasProps> = ({
    trigger,
    title = "Offcanvas Title",
    children,
    ...props
}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [width] = useWindowSize(); 


    const isMobile: boolean = width < 768;

    return (
        <>
            <div onClick={handleShow} style={{ display: 'inline' }}>
                {trigger}
            </div>

            <Offcanvas
                show={show}
                onHide={handleClose}
                style={{
                    width: isMobile ? '100%' : 'auto',
                    minWidth: isMobile ? '100%' : '25%', 
                    transition: 'width 0.3s ease-in-out', 
                }}
                {...props}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{title}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body >
                    {children}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}