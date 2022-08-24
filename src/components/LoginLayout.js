import logo from '../assets/images/logo.svg';
import mainImg from '../assets/images/bg.png';
import { ToastContainer } from "react-toastify";
import { Outlet } from 'react-router-dom';

const Register = () =>{
    return (
        <div className="login-wrap">
            <div className="main-image-wrap">
                <img src={logo} alt={logo} className="logo"></img>
                <img src={mainImg} alt={mainImg} className="main-image"></img>
            </div>
            <div className="login-card">
                <Outlet />
            </div>
            <ToastContainer />
        </div>
    );
}

export default Register;