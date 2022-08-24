import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () =>{
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
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
            navigate('/');
        } catch (err) {
            const errTitle = err?.response?.data?.message;
            const errContent = err?.response?.data?.error;
            notify('error', errTitle, errContent);
        }
    };

    return (
        <>
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
            <button type="button" className="sub-btn" onClick={() => navigate('/register')}>註冊帳號</button>
        </>
    );
}

export default Login;