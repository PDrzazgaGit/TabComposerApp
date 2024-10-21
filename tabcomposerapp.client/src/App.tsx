import { Route, Routes } from "react-router-dom";
import { MyNavbar } from './components/MyNavbar';
import { About, Home, Results } from './components/pages';
import { AuthProvider } from "./context/AuthContext";

function App() {

    return (
        <AuthProvider>
            <MyNavbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About/>}/>
                <Route path="/results" element={<Results />}/>
                <Route path="/login" element={<></>}/>
            </Routes>
        </AuthProvider>
    );

}

export default App;