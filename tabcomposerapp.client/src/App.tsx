import { Route, Routes } from "react-router-dom";
import { MyNavbar } from './components/MyNavbar';
import { Home, Editor } from './components/pages';
import { AuthProvider } from "./context/AuthProvider";
import { UserTabs } from "./components/pages/UserTabs";
import { Login } from "./components/pages/Login";
import { Player } from "./components/pages/Player";
import { TabulatureApiProvider } from "./context/TabulatureApiProvider";

function App() {

    return (
        <AuthProvider>
            <TabulatureApiProvider>
                <MyNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/player" element={<Player />} />
                    <Route path="/mytabs" element={<UserTabs />}></Route>
                    <Route path="/editor" element={<Editor />} />
                </Routes>
            </TabulatureApiProvider>
        </AuthProvider>
    );

}

export default App;