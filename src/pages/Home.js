import React from 'react';
import Header from '../components/Header';
import addTodoBtn from '../assets/images/add-todo-btn.svg';
import emptyBg from '../assets/images/empty-bg.png';
import deleteBtn from '../assets/images/delete.svg';
import axios from "axios";

const { useState, useEffect } = React;

const AddTodo = ({ getTodos, addTodo }) => {
    const [ inputTodo, setInputTodo ] = useState('');

    const submitHandler = async () => {
        if (!inputTodo) {
            return;
        }
        await addTodo(inputTodo);
        setInputTodo('');
        getTodos();
    }

    return (
        <div className="add-todos-wrap">
            <input
                type="text"
                name="input"
                placeholder="新增待辦事項"
                className="add-todo-input"
                value={inputTodo}
                onChange={e => setInputTodo(e.target.value)}
            />
            <img
                src={addTodoBtn} alt={addTodoBtn}
                className={ inputTodo ? 'add-todo-btn' : 'add-todo-btn disabled'}
                onClick={submitHandler}
            />
        </div>
    );
}

const TodoList = ({ todoList, editStatus, deleteSingleTodo, deleteMultipleTodos }) => {
    const unfinishedList = todoList.filter(item => !item.completed_at); // 未完成項目
    const finishedList = todoList.filter(item => !!item.completed_at); // 已完成項目
    const finishedIds = finishedList.map(item => item.id); // 已完成項目id

    const [ status, setStatus ] = useState('all');

    // 依據 tab 篩選顯示 todo-list
    const showTodoList = () => {
        let returnArr = [];
        switch (status) {
            case 'unfinished':
                returnArr = unfinishedList;
                break;
            case 'finished':
                returnArr = finishedList;
                break;
            default:
                returnArr = todoList;
                break;
        }
        return returnArr;
    }

    return (
        <div className="todo-list-card">
            <div className="card-header">
                <button type="button" className={ status === 'all' ? 'tab-btn active' : 'tab-btn'} onClick={() => setStatus('all')}>全部</button>
                <button type="button" className={ status === 'unfinished' ? 'tab-btn active' : 'tab-btn'} onClick={() => setStatus('unfinished')}>待完成</button>
                <button type="button" className={ status === 'finished' ? 'tab-btn active' : 'tab-btn'} onClick={() => setStatus('finished')}>已完成</button>
            </div>
            <div className="card-body">
                <ul>
                    {
                        showTodoList().map(item =>
                            <li className="todo-wrap" key={item.id}>
                                <input type="checkbox" id={item.id} checked={!!item.completed_at} 
                                    onChange={() => editStatus(item.id)} />
                                <label htmlFor={item.id}>{item.content}</label>
                                <button type="button" className="delete-btn" onClick={() => deleteSingleTodo(item.id)}>
                                    <img src={deleteBtn} alt={deleteBtn} />
                                </button>
                            </li>
                        )
                    }
                </ul>
            </div>
            <div className="card-footer">
                <p>{unfinishedList.length} 個待完成項目</p>
                <button type="button" className="clear-finished-btn" onClick={() => deleteMultipleTodos(finishedIds)}>清除已完成項目</button>
            </div>
        </div>
    );
}

const Empty = () => {
    return (
        <div className="empty-wrap">
            <p>目前尚無待辦事項</p>
            <img src={emptyBg} alt={emptyBg} className="empty-bg" />
        </div>
    );
}

const Home = () =>{
    const [ todoList, setTodoList ] = useState([]);
    const [ userInfo, setUserInfo ] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = JSON.parse(localStorage.getItem('reactTodoList'));
            setUserInfo(data);

            const response = await axios({
                url: "https://todoo.5xcamp.us/todos",
                method: "get",
                headers: {
                    authorization: data.token
                }
            });
            setTodoList(response.data.todos);
        };
        fetchData();
    }, []);

    // 取得 todo-list
    const getTodos = async () => {
        const response = await axios({
            url: "https://todoo.5xcamp.us/todos",
            method: "get",
            headers: {
                authorization: userInfo.token
            }
        });
        setTodoList(response.data.todos);
    };

    // 新增 todo
    const addTodo = async content => {
        await axios({
            url: "https://todoo.5xcamp.us/todos",
            method: "post",
            headers: {
                authorization: userInfo.token
            },
            data: {
                todo: {
                    content
                }
            }
        });
        getTodos();
    }

    // 切換狀態（完成/未完成）
    const editStatus = async id => {
        await axios({
            url: `https://todoo.5xcamp.us/todos/${id}/toggle`,
            method: "patch",
            headers: {
                authorization: userInfo.token
            }
        });
        getTodos();
    }

    // 刪除 todo 方法
    const deleteTodo = async id => {
        await axios({
            url: `https://todoo.5xcamp.us/todos/${id}`,
            method: "delete",
            headers: {
                authorization: userInfo.token
            }
        });
    }

    // 刪除單筆 todo
    const deleteSingleTodo = async id => {
        await deleteTodo(id);
        getTodos();
    }

    // 刪除多筆 todos
    const deleteMultipleTodos = async ids => {
        const deleteTodos = ids.map(id => {
            return new Promise(async resolve => {
                await deleteTodo(id);
                resolve();
            });
        });
        await Promise.all(deleteTodos);
        getTodos();
    }

    return (
        <div className="home">
            <Header userInfo={userInfo}></Header>
            <div className="todo-list-wrap">
                <AddTodo getTodos={getTodos} addTodo={addTodo}></AddTodo>
                {
                    todoList.length
                        ? <TodoList todoList={todoList} editStatus={editStatus} deleteSingleTodo={deleteSingleTodo}
                            deleteMultipleTodos={deleteMultipleTodos}></TodoList>
                        : <Empty></Empty>
                }
            </div>
        </div>
    );
}

export default Home;