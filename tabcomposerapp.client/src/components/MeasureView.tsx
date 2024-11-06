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

    // U�ycie forEach do renderowania NoteView dla ka�dej nuty
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
W jaki spos�b najlepiej by�oby utworzy� widok tabulatury gitarowej w aplikacji react.ts (korzystam z react-bootstrap)? Za�o�enia s� nast�puj�ce:

1. Tabulatura zajmuje obszar w postaci prostok�ta, kt�ry rozci�ga si� na szeroko�� ekranu (z odpowiednimi marginesami). Kolejne linie znajduj� si� pod spodem, np:

<---szeroko�� ekranu-------------->

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

2. Tabulatura sk�ada si� z takt�w. Je�eli takt nie zmie�ci si� ca�y w linii, to reszta wy�wietla si� poni�ej, np: 

<----------szeroko�� ekranu-------------->

4/4                 4/4             3/4

E |----------------|-----------------|----
B |----------------|-----------------|----
G |----------------|-----------------|----          <- tutaj si� nie mie�ci
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

3. Ka�dy takt ma sw�j czas wyra�ony w ms. Niech szeroko�� wy�wietlanego taktu zale�y od tego czasu w ms.

4. Ka�da nuta ma sw�j start_time_stamp wzgl�dnie swojego taktu. Niech nuta wy�wietla si� na strunie w zale�no�ci od momentu czasu swojego taktu. Np je�li takt trwa 2000 sekund, a nuta ma sw�j start_time_stamp w 500ms, to powinna zosta� wy�wietlona w 1/4 taktu.

    4/4 2000ms       3/4 1500ms

E |----5-----------|------------|  <- nuta '5' ma start time stamp na 500ms
B |----------------|------------|
G |----------------|------------|      
D |----------------|--------8---|  <- nuta '8' ma start time stamp na 1500 ms
A |----------------|------------|
E |----------------|------------|

Na t� por� mam ju� stworzony model tabulatury. Klasa tabulatura zawiera list� takt�w, natomiast klasa taktu definiuje swoj� d�ugo�� w ms w zalezno�ci od swoich parametr�w, posiada mapowanie swoich Nut na wszystkich strunach (struktura mapy). Klasa Nuty posiada m.in sw�j start_time_stamp i numer progu.

*/

/*
ODRZUCAM
1. Komponent A zajmuje ca�� szeroko�� ekranu. Wysoko�� tego komponentu zale�y od ilo�ci komponent�w B (czyli jego dzieci). 
2. Komponent B zajmuje okre�lon� cz�� (szeroko��) komponentu A. Kolejne komponenty B kolejno wype�niaj� komponent A z lewej do prawej strony.
3. Gdy komponent B nie mie�ci si� ca�kowicie w komponencie A, to dzieli si� na dwie cz�ci, jedna wype�nia brakuj�c� przestrze� w poziomie, natomiast druga przenosi si� poni�ej. Komponent A zwi�ksza wtedy swoj� szeroko��.
4. Widok jest responsywny, to znaczy w zale�no�ci od szeroko�ci ekranu komponenty B uk�adaj� si� jak wspomnia�em powy�ej.

*/

/*
Czy da si� w react.ts (ja korzystam te� z react-bootstrap) stworzy� dwa komponenty, kt�re b�d� si� zachowywa� w nast�puj�cy spos�b:

1. Komponent A zajmuje ca�� szeroko�� ekranu. Wysoko�� tego komponentu zale�y od ilo�ci komponent�w B (czyli jego dzieci).
2. Komponent B posiada swoj� d�ugo��, wyra�on� w milisekundach (to czemu tak jest, narazie nie jest istotne). Warto�� ta jest przeliczana na szeroko�� komponentu B, kt�r� zajmuje w komponencie A. 
3. Komponent A posiada kilka komponent�w B w linii. Je�eli jaki� komponent nie zmie�ci si� w danej linii to zostaje przeniesiony do nowej linii.
4. Niewykorzystane miejsce w linii (czyli takie miejsce, w kt�re nie zmie�ci si� nast�pny Komponent B) musi by� r�wno rozdysponowane, komponenty B w danej linii zwi�kszaj� swoj� szeroko�� r�wnomiernie aby si� dopasowa�.

Np:

Komponent A, szeroko�� 44

<------------------------------------------>

Komponenty B, szeroko�� 10

<--------><--------><--------><-------->        <- wolne miejsce szeroko�� 4

Dodaj� komponent B o szeroko�ci 12

<---------><---------><---------><--------->   <- komponenty dopasowa�y si� do szeroko�ci po r�wno
<---------------->                             <- nowy komponent 12

5. Szeroko�ci komponent�w B wyra�one w %
*/

/*

Czy da si� w react.ts (ja korzystam te� z react-bootstrap) stworzy� dwa komponenty, kt�re b�d� si� zachowywa� w nast�puj�cy spos�b:

1. Komponent A zajmuje ca�� szeroko�� ekranu. Wysoko�� tego komponentu zale�y od ilo�ci komponent�w B (czyli jego dzieci).
2. Komponent A mo�e zawiera� w linii n komponent�w B. Je�eli komponent zawiera jeden komponent B to szeroko�� komponentu B to 50% i jest wyr�wnany do lewej strony, je�eli dwa to maj� 50% szeroko��, je�eli trzy to po 33.3333%  itd. a� do n.
3. Kolejny ka�dy komponent niemieszcz�cy sie w linii dodawany jest poni�ej.

*/