import { Route, Routes } from "react-router-dom";
import { MyNavbar } from './components/MyNavbar';
import { About, Home, Results, Login } from './components/pages';

function App() {

    return (
        <>
            <MyNavbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About/>}/>
                <Route path="/results" element={<Results />}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </>
    );

}

export default App;