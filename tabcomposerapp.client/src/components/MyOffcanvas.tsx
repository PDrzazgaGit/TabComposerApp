import { FC, ReactNode, useState } from 'react';
import Offcanvas, { OffcanvasProps } from 'react-bootstrap/Offcanvas';
import { useWindowSize } from '@react-hook/window-size';  // Hook do wykrywania rozmiaru okna

interface MyOffcanvasProps extends OffcanvasProps {
    trigger?: ReactNode;
    title?: string;
    children: ReactNode;
    alwaysShow?: boolean;
    handleClose?: () => void;
}

export const MyOffcanvas: FC<MyOffcanvasProps> = ({
    trigger,
    title = "Offcanvas Title",
    children,
    alwaysShow = false,
    handleClose,
    ...props
}) => {
    const [show, setShow] = useState(alwaysShow);

    const defaultHandleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [width] = useWindowSize();
    const isMobile: boolean = width < 768;

    return (
        <>
            {!alwaysShow && (
                <div onClick={handleShow} style={{ display: 'inline' }}>
                    {trigger}
                </div>
            )}

            <Offcanvas
                show={show}
                onHide={handleClose || defaultHandleClose}
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
};
