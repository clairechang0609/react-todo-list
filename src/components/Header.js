import React from 'react';
import logo from '../assets/images/logo.svg';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const { useState, useEffect } = React;

const Header = ({ userInfo }) => {
    const navigate = useNavigate();
    const [ shouldLogout, setShouldLogout ] = useState(false);

    const handleClick = e => {
        e.preventDefault();
        logout();
    };

    const logout = async () => {
        await axios({
            url: "https://todoo.5xcamp.us/users/sign_out",
            method: "delete",
            headers: {
                authorization: userInfo?.token
            }
        });
        localStorage.removeItem('reactTodoList');
        setShouldLogout(true);
    };

    useEffect(() => {
        if (shouldLogout) {
            navigate('/login');
        }
    });

    return (
        <div className="header">
            <img src={logo} alt={logo} className="logo"></img>
            <div className="logout-wrap">
                <h6 className="user">{userInfo?.user}的代辦</h6>
                <a href="/#/" className="logout-btn" onClick={handleClick}>登出</a>
            </div>
        </div>
    );
}

export default Header;