import { Route, Routes } from "react-router-dom";
import { MyNavbar } from './components/MyNavbar';
import { Home, Editor } from './components/pages';
import { AuthProvider } from "./context/AuthProvider";
import { ErrorProvider } from "./context/ErrorProvider";
import { AuthRoute } from "./components/AuthRoute";
import { UserTabs } from "./components/pages/UserTabs";
import { Login } from "./components/pages/Login";

function App() {

    return (
        <ErrorProvider>
            <AuthProvider>
                <MyNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<AuthRoute />}>
                        <Route path="/mytabs" element={<UserTabs/>}></Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </ErrorProvider>
       
    );

}

export default App;