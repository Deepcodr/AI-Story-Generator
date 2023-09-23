import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './custom.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = (props) => {
    const nav = useNavigate();
    const [isRegister, setRegister] = useState(false);

    useEffect(() => {
        var token = localStorage.getItem('jwt');
        axios.get('http://127.0.0.1:5000/session', {
            headers: {
                'x-access-token': token
            }
        }).then((response) => {
            if (response.data === false) {
            }
            else {
                nav('/userhome');
            }
        })
    }, [nav])

    const [userName, setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const [Name, setName] = useState('');
    const [Phone, setPhone] = useState('');
    const handleNameChange = (e) => {
        setName(e.target.value);

    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    }
    const handleUserNameChange = (e) => {
        setUserName(e.target.value);

    };

    const handlePasswordChange = (e) => {
        setPassWord(e.target.value);
    };

    const handleLogin = (e) => {
        axios.post('http://127.0.0.1:5000/login', {
            username: userName,
            password: passWord
        }).then(function (response) {
            if (response.data.status === 200) {
                localStorage.setItem('jwt', response.data.token);
                nav('/userhome');
            }
            else {
                alert(response.data.message);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    const handleRegister = (e) => {
        if( Name && Phone && userName && passWord )
        {
            axios.post('http://127.0.0.1:5000/register', {
                name: Name,
                mobile: Phone,
                username: userName,
                password: passWord
            }).then(function (response) {
                if (response.data.status === 200) {
                    alert(`Registration Successful ${response.data.message}`);
                    setRegister(false);
                }
                else {
                    alert(response.data.message);
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
        else
        {
            alert("Enter Valid Input");
        }
    }

    if (!isRegister) {
        return (
            <div className="container-fluid glowing-back text-white min-vh-100 d-flex flex-column justify-content-center align-items-center" >
                <h1 className='display-3'>Login Here</h1>
                <div className="m-4 d-flex flex-column">
                    <input
                        type="text"
                        value={userName}
                        placeholder='Enter Your Username'
                        onChange={handleUserNameChange}
                        className="glow-input form-control mb-5"
                    />
                    <input
                        type="text"
                        value={passWord}
                        placeholder='Enter Your Password'
                        onChange={handlePasswordChange}
                        className="glow-input form-control mb-4"
                    />
                    <div className="mt-4">
                        <Link to="/" className="btn text-light border btn-lg">Home</Link>
                        <button onClick={handleLogin} className="btn text-light border btn-lg m-3">Login</button>
                        <button onClick={() => setRegister(true)} className="btn text-light border btn-lg">Register</button>
                    </div>
                </div>
            </div >
        )
    }
    else {
        return (
            <div className="container-fluid glowing-back text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
                <h1 className='display-3'>Register Here</h1>
                <div className="m-4 d-flex flex-column">
                    <input
                        type="text"
                        value={Name}
                        placeholder='Enter Your Name'
                        onChange={handleNameChange}
                        className="glow-input form-control mb-4"
                    />
                    <input
                        type="number"
                        value={Phone}
                        placeholder='Enter Your Phone Number'
                        onChange={handlePhoneChange}
                        className="glow-input form-control mb-4"
                    />
                    <input
                        type="text"
                        value={userName}
                        placeholder='Enter Your Username'
                        onChange={handleUserNameChange}
                        className="glow-input form-control mb-4"
                    />
                    <input
                        type="text"
                        value={passWord}
                        placeholder='Enter Your Password'
                        onChange={handlePasswordChange}
                        className="glow-input form-control mb-4"
                    />
                    <div className="mt-4">
                        <Link to="/" className="btn text-light border btn-lg">Home</Link>
                        <button onClick={() => setRegister(false)} className="btn text-light border btn-lg m-3">Login</button>
                        <button onClick={handleRegister} className="btn text-light border btn-lg">Register</button>
                    </div>
                </div>
            </div>
        )
    }
};

export default Login;