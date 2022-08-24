import './scss/style.scss';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginLayout from "./components/LoginLayout";

function App() {
    return (
        <div className="App">
            {/* 註冊路由表 */}
            <Routes>
                <Route path="/" element={<LoginLayout />}>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/register" element={<Register />}/>
                </Route>
                <Route exact={true} path="/" element={<Home />}/>
                {/* <Route path="*" element={<NotFound />}/> */}
            </Routes>
        </div>
    );
}

export default App;
