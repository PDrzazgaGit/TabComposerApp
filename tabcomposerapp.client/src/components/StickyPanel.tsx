import { ReactNode } from "react";

interface StickyPanelProps {
    children: ReactNode;
    content: ReactNode;
}

export const StickyPanel: React.FC<StickyPanelProps> = ({ children, content }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column"
            }}
        >
            <div style={{ flex: "1 0 auto" }}>{children}</div>
            <div
                style={{
                    position: "sticky",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    zIndex: 10,
                    padding: 0,
                    margin: 0
                }}
            >
                {content}
            </div>
        </div>
    );
};