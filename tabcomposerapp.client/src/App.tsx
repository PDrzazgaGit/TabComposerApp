import { Route, Routes } from "react-router-dom";
import { MyNavbar } from './components/MyNavbar';
import { Home, Editor } from './components/pages';
import { AuthProvider } from "./context/AuthProvider";
import { ErrorProvider } from "./context/ErrorProvider";
import { AuthRoute } from "./components/AuthRoute";
import { UserTabs } from "./components/pages/UserTabs";
import { Login } from "./components/pages/Login";
import { TabulatureProvider } from "./context/TabulatureProvider";

function App() {

    return (
        <ErrorProvider>
            <AuthProvider>
                <TabulatureProvider>
                    <MyNavbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />            
                            <Route path="/editor" element={<Editor />} />
                            <Route element={<AuthRoute />}>
                                <Route path="/mytabs" element={<UserTabs />}></Route>
                            </Route>        
                    </Routes>
                </TabulatureProvider> 
            </AuthProvider>
        </ErrorProvider>
       
    );

}

export default App;