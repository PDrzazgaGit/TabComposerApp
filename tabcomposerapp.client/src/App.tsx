import { Route, Routes } from "react-router-dom";
import { Editor, Home, Login, MyNavbar, Player, TryEditor, UserTabs } from './components';
import { AuthProvider, TabulatureApiProvider } from "./context";

function App() {

    return (
        <AuthProvider>
            <TabulatureApiProvider>
                <MyNavbar />
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/player"
                        element={<Player />}
                    />
                    <Route
                        path="/mytabs"
                        element={<UserTabs />}
                    />
                    <Route
                        path="/editor"
                        element={<Editor />}
                    />
                    <Route
                        path="/tryeditor"
                        element={<TryEditor />}
                    />
                </Routes>
            </TabulatureApiProvider>
        </AuthProvider>
    );

}

export default App;