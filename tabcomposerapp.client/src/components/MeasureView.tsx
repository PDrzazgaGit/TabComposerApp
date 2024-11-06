import { useEffect, useState } from "react";
import { IMeasure, INote, NoteDuration } from "../models";
import { TuningFactory } from "../services";
import {useMeasure } from "./../hooks/useMeasure"
import { Measure } from "./../services/Measure"
import { NoteView } from "./NoteView";
import { Button } from "react-bootstrap";

interface MeasureViewProps {
    measure: IMeasure;
}


export const MeasureView: React.FC<MeasureViewProps> = ({ measure }) => {

    const { setMeasure } = useMeasure();

    useEffect(() => {
        setMeasure(measure);
    }, [measure, setMeasure]); 

    const noteComponents: JSX.Element[] = [];

    // U¿ycie forEach do renderowania NoteView dla ka¿dej nuty
    measure.forEach((notes: INote[], stringId: number) => {
        notes.forEach((note) => {
            noteComponents.push(
                <NoteView note={note} stringId={stringId} />
            );
            noteComponents.push(<span >-</span>);
        });
        noteComponents.push(<br />);
    });

    return (
        <>
            {noteComponents}
           
        </>
    );
}

/*
W jaki sposób najlepiej by³oby utworzyæ widok tabulatury gitarowej w aplikacji react.ts (korzystam z react-bootstrap)? Za³o¿enia s¹ nastêpuj¹ce:

1. Tabulatura zajmuje obszar w postaci prostok¹ta, który rozci¹ga siê na szerokoœæ ekranu (z odpowiednimi marginesami). Kolejne linie znajduj¹ siê pod spodem, np:

<---szerokoœæ ekranu-------------->

E ---------------------------------
B ---------------------------------
G ---------------------------------
D ---------------------------------
A ---------------------------------
E ---------------------------------


-----------------------------------
-----------------------------------
-----------------------------------
-----------------------------------
-----------------------------------
-----------------------------------

2. Tabulatura sk³ada siê z taktów. Je¿eli takt nie zmieœci siê ca³y w linii, to reszta wyœwietla siê poni¿ej, np: 

<----------szerokoœæ ekranu-------------->

4/4                 4/4             3/4

E |----------------|-----------------|----
B |----------------|-----------------|----
G |----------------|-----------------|----          <- tutaj siê nie mieœci
D |----------------|-----------------|----
A |----------------|-----------------|----
E |----------------|-----------------|----

3/4             4/4             itd...
--------|-----------------|--------------
--------|-----------------|--------------
--------|-----------------|--------------
--------|-----------------|--------------
--------|-----------------|--------------
--------|-----------------|--------------

3. Ka¿dy takt ma swój czas wyra¿ony w ms. Niech szerokoœæ wyœwietlanego taktu zale¿y od tego czasu w ms.

4. Ka¿da nuta ma swój start_time_stamp wzglêdnie swojego taktu. Niech nuta wyœwietla siê na strunie w zale¿noœci od momentu czasu swojego taktu. Np jeœli takt trwa 2000 sekund, a nuta ma swój start_time_stamp w 500ms, to powinna zostaæ wyœwietlona w 1/4 taktu.

    4/4 2000ms       3/4 1500ms

E |----5-----------|------------|  <- nuta '5' ma start time stamp na 500ms
B |----------------|------------|
G |----------------|------------|      
D |----------------|--------8---|  <- nuta '8' ma start time stamp na 1500 ms
A |----------------|------------|
E |----------------|------------|

Na t¹ porê mam ju¿ stworzony model tabulatury. Klasa tabulatura zawiera listê taktów, natomiast klasa taktu definiuje swoj¹ d³ugoœæ w ms w zaleznoœci od swoich parametrów, posiada mapowanie swoich Nut na wszystkich strunach (struktura mapy). Klasa Nuty posiada m.in swój start_time_stamp i numer progu.

*/

/*
ODRZUCAM
1. Komponent A zajmuje ca³¹ szerokoœæ ekranu. Wysokoœæ tego komponentu zale¿y od iloœci komponentów B (czyli jego dzieci). 
2. Komponent B zajmuje okreœlon¹ czêœæ (szerokoœæ) komponentu A. Kolejne komponenty B kolejno wype³niaj¹ komponent A z lewej do prawej strony.
3. Gdy komponent B nie mieœci siê ca³kowicie w komponencie A, to dzieli siê na dwie czêœci, jedna wype³nia brakuj¹c¹ przestrzeñ w poziomie, natomiast druga przenosi siê poni¿ej. Komponent A zwiêksza wtedy swoj¹ szerokoœæ.
4. Widok jest responsywny, to znaczy w zale¿noœci od szerokoœci ekranu komponenty B uk³adaj¹ siê jak wspomnia³em powy¿ej.

*/

/*
Czy da siê w react.ts (ja korzystam te¿ z react-bootstrap) stworzyæ dwa komponenty, które bêd¹ siê zachowywaæ w nastêpuj¹cy sposób:

1. Komponent A zajmuje ca³¹ szerokoœæ ekranu. Wysokoœæ tego komponentu zale¿y od iloœci komponentów B (czyli jego dzieci).
2. Komponent B posiada swoj¹ d³ugoœæ, wyra¿on¹ w milisekundach (to czemu tak jest, narazie nie jest istotne). Wartoœæ ta jest przeliczana na szerokoœæ komponentu B, któr¹ zajmuje w komponencie A. 
3. Komponent A posiada kilka komponentów B w linii. Je¿eli jakiœ komponent nie zmieœci siê w danej linii to zostaje przeniesiony do nowej linii.
4. Niewykorzystane miejsce w linii (czyli takie miejsce, w które nie zmieœci siê nastêpny Komponent B) musi byæ równo rozdysponowane, komponenty B w danej linii zwiêkszaj¹ swoj¹ szerokoœæ równomiernie aby siê dopasowaæ.

Np:

Komponent A, szerokoœæ 44

<------------------------------------------>

Komponenty B, szerokoœæ 10

<--------><--------><--------><-------->        <- wolne miejsce szerokoœæ 4

Dodajê komponent B o szerokoœci 12

<---------><---------><---------><--------->   <- komponenty dopasowa³y siê do szerokoœci po równo
<---------------->                             <- nowy komponent 12

5. Szerokoœci komponentów B wyra¿one w %
*/

/*

Czy da siê w react.ts (ja korzystam te¿ z react-bootstrap) stworzyæ dwa komponenty, które bêd¹ siê zachowywaæ w nastêpuj¹cy sposób:

1. Komponent A zajmuje ca³¹ szerokoœæ ekranu. Wysokoœæ tego komponentu zale¿y od iloœci komponentów B (czyli jego dzieci).
2. Komponent A mo¿e zawieraæ w linii n komponentów B. Je¿eli komponent zawiera jeden komponent B to szerokoœæ komponentu B to 50% i jest wyrównany do lewej strony, je¿eli dwa to maj¹ 50% szerokoœæ, je¿eli trzy to po 33.3333%  itd. a¿ do n.
3. Kolejny ka¿dy komponent niemieszcz¹cy sie w linii dodawany jest poni¿ej.

*/