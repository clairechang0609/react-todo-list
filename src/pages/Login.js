import React from 'react';
import logo from '../assets/images/logo.svg';
import mainImg from '../assets/images/bg.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const { useState, useEffect } = React;

const Login = () =>{
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ status, setStatus ] = useState('login');
    const [ shouldLogin, setShouldLogin ] = useState(false);
    // notify toast
    const notify = (type, title, messages = []) => 
        toast[type](
            <>
                <h5>{title}</h5>
                <ul className="notify-content">
                    {
                        messages.map(item => <li>{item}</li>)
                    }
                </ul>
            </>,
            {
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true
            }
        );

    // 註冊
    const submitRegister = async form => {
        try {
            const response = await axios({
                url: "https://todoo.5xcamp.us/users",
                method: "post",
                data: {
                    user: form
                }
            });
            notify('success', response?.data?.message);
        } catch (err) {
            const errTitle = err?.response?.data?.message;
            const errContent = err?.response?.data?.error;
            notify('error', errTitle, errContent);
        }
    };
    
    // 登入
    const submitLogin = async form => {
        try {
            const response = await axios({
                url: "https://todoo.5xcamp.us/users/sign_in",
                method: "post",
                data: {
                    user: form
                }
            });
            const userInfo = JSON.stringify({
                token: response.headers?.authorization,
                user: response.data?.nickname
            });
            localStorage.setItem('reactTodoList', userInfo);
            setShouldLogin(true);
        } catch (err) {
            const errTitle = err?.response?.data?.message;
            const errContent = err?.response?.data?.error;
            notify('error', errTitle, errContent);
        }
    };

    useEffect(() => {
        if (shouldLogin) {
            navigate('/');
        }
    });

    return (
        <div className="login-wrap">
            <div className="main-image-wrap">
                <img src={logo} alt={logo} className="logo"></img>
                <img src={mainImg} alt={mainImg} className="main-image"></img>
            </div>
            <div className="login-card">
                {
                    status === 'login'
                        ? <>
                            <h2 className="title">最實用的線上代辦事項服務</h2>
                            <form onSubmit={handleSubmit(submitLogin)} className="form">
                                <div className="input-wrap">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" placeholder="請輸入Email" {...register("email", { required: true })} />
                                    <small className="alert">{ errors.email && '此欄位不可為空' }</small>
                                </div>
                                <div className="input-wrap">
                                    <label htmlFor="password">密碼</label>
                                    <input type="password" name="password" placeholder="請輸入密碼" {...register("password", { required: true })} />
                                    <small className="alert">{ errors.password && '此欄位不可為空' }</small>
                                </div>
                                <button type="submit" className="main-btn">登入</button>
                            </form>
                            <button type="button" className="sub-btn" onClick={() => setStatus('register')}>註冊帳號</button>
                        </>
                        : <>
                        <h2 className="title">註冊帳號</h2>
                        <form onSubmit={handleSubmit(submitRegister)} className="form">
                            <div className="input-wrap">
                                <label htmlFor="registerEmail">Email</label>
                                <input type="email" id="registerEmail" name="email" placeholder="請輸入Email" {...register("registerEmail", { required: true })} />
                                <small className="alert">{ errors.registerEmail && '此欄位不可為空' }</small>
                            </div>
                            <div className="input-wrap">
                                <label htmlFor="nickname">您的暱稱</label>
                                <input type="text" name="nickname" placeholder="請輸入您的暱稱" {...register("nickname", { required: true })} />
                                <small className="alert">{ errors.nickname && '此欄位不可為空' }</small>
                            </div>
                            <div className="input-wrap">
                                <label htmlFor="password">密碼</label>
                                <input type="password" name="password" placeholder="請輸入密碼" {...register("password", { required: true })} />
                                <small className="alert">{ errors.password && '此欄位不可為空' }</small>
                            </div>
                            <div className="input-wrap">
                                <label htmlFor="confirmPassword">再次輸入密碼</label>
                                <input type="password" name="confirmPassword" placeholder="請輸入密碼"
                                    {...register("confirmPassword", {
                                        required: true,
                                        validate: val => {
                                            return watch('password') === val || "密碼需吻合";
                                        }
                                    })}
                                />
                                <small className="alert">{ errors.confirmPassword && (errors.confirmPassword.message || '此欄位不可為空') }</small>
                            </div>
                            <button type="submit" className="main-btn">註冊帳號</button>
                        </form>
                        <button type="button" className="sub-btn" onClick={() => setStatus('login')}>登入</button>
                    </>
                }
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;