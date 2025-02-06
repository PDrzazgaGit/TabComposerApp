import { ReactNode, useState } from "react";
import { StickyPanel } from "./StickyPanel";
import { Card, Tabs, Tab} from "react-bootstrap";
import { GlobalSettings } from "./GlobalSettings";
import { PlayerSettings } from "./PlayerSettings";
import { RecorderSettings } from "./RecorderSettings";

interface EditorToolbarProps {
    children: ReactNode;
    playerMode?: boolean;
    previewMode?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ children, playerMode = false, previewMode = false }) => {

    const [tabKey, setTabKey] = useState<string | null>(null);

    const renderFooterContent = () => (
        <Card>
            <Card.Body

            >
               
                <Tabs
                    activeKey={tabKey ? tabKey : (playerMode ? "player" : 'toolbar')}
                    onSelect={(k) => setTabKey(k)}
                    className="mb-3"
                    fill
                >
                    {!playerMode && (
                        <Tab
                            eventKey="toolbar" title="Global Toolbar"
                        >
                            <GlobalSettings previevMode={ previewMode } />
                        </Tab>
                    )} 
                    <Tab
                        eventKey="player" title="Tab Player"
                    >
                        <PlayerSettings playing={tabKey === "player"} />
                    </Tab>
                    {!playerMode && (
                        <Tab
                            eventKey="recorder" title="Tab Recorder"
                        >
                            <RecorderSettings/>
                        </Tab>
                    )} 
                </Tabs>
            </Card.Body>
        </Card>


    )

    return (
        <StickyPanel content={renderFooterContent()}>
            { children }
        </StickyPanel>
    );
}