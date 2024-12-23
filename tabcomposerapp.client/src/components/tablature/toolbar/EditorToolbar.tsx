import { ReactNode, useState } from "react";
import { StickyPanel } from "./StickyPanel";
import { Card, Tabs, Tab, Button, Dropdown, FormCheck, FormControl, InputGroup } from "react-bootstrap";
import { NoteDuration } from "../../../models";
import { noteRepresentationMap } from "../../../utils/noteUtils";
import { useTabulature } from "../../../hooks/useTabulature";
import { TabulaturePlayer } from "../../../services/audio/TabulaturePlayer";
import { GlobalSettings } from "./GlobalSettings";
import { PlayerSettings } from "./PlayerSettings";

interface EditorToolbarProps {
    children: ReactNode;
    playerMode?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ children, playerMode = false }) => {

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
                            <GlobalSettings/>
                        </Tab>
                    )} 
                    <Tab
                        eventKey="player" title="Tab Player"
                    >
                        <PlayerSettings/>
                    </Tab>
                    {!playerMode && (
                        <Tab
                            eventKey="recorder" title="Tab Recorder"
                        >
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