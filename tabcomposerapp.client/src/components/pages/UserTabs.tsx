import { Container } from "react-bootstrap";
import { getUserTabulaturesInfo } from "../../api/TabulatureService";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Notation } from "../../models/NotationModel";

interface TabulatureInfo {
    title: string;
    created: string;
    length: number;
    tuning: { notation: number }[];
}

export const UserTabs = () => {
    const { user } = useAuth();
    const [info, setInfo] = useState<Record<number, TabulatureInfo>>({});

    useEffect(() => {
        if (user) {
            const fetchTablatureData = async () => {
                try {
                    const data = await getUserTabulaturesInfo(user.token);
                    setInfo(data);
                } catch (error) {
                    console.error("Error fetching tablatures:", error);
                }
            };
            fetchTablatureData();
        }
        console.log(info);
    }, [user]);

    return (
        <Container>
            <h1>My Tabs</h1>
            {Object.entries(info).map(([key, tab]) => (
                <div key={key}>
                    <h2>Tabulatures for ID {key}</h2>
                    <p>{ tab.title }</p>
                    <p>{ tab.created }</p>
                    <p>{ tab.length }</p>
                    <p>{tab.tuning.map((notation) => {
                        return (
                            <p>
                                {Notation[Number(notation.notation)]}
                           </p>
                        );
                    })}</p>
                </div>
            ))}
        </Container>
    );
};
