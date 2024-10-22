import { Route, Routes } from "react-router-dom";
import { MyNavbar } from './components/MyNavbar';
import { About, Home } from './components/pages';
import { AuthProvider } from "./context/AuthProvider";
import { ErrorProvider } from "./context/ErrorProvider";
import { AuthRoute } from "./components/AuthRoute";

function App() {

    return (
        <ErrorProvider>
            <AuthProvider>
                <MyNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route element={<AuthRoute />}>
                        <Route path="/account"></Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </ErrorProvider>
       
    );

}

export default App;