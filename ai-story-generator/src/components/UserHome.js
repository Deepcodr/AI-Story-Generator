import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserHome = () => {
    const [User, setUser] = useState('');
    const nav = useNavigate();

    useEffect(() => {
        var token = localStorage.getItem('jwt');
        axios.get('http://127.0.0.1:5000/session', {
            headers: {
                'x-access-token': token
            }
        }).then((response) => {
            if (response.data === false) {
                nav('/login');
            }
            else {
                setUser(response.data.username);
            }
        })
    }, [nav])

    const handleLogout = () => {
        if (localStorage.getItem('jwt')) {
            axios.post('http://127.0.0.1:5000/logout', {
                headers: {
                    'x-access-token': localStorage.getItem('jwt')
                }
            }).then(function (response) {
                if (response.status === 200) {
                    localStorage.setItem('jwt', null);
                    nav('/');
                }
            })
        }
    }

    return (
        <div className="container-fluid glowing-back text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <h1>Welcome @{User}</h1>
            <div className="mt-4">
                <Link to="/storygenerate" className="btn text-light border btn-lg me-3">Generate Story</Link>
                <Link to="/feed" className="btn text-light border btn-lg me-3">Feed</Link>
                <Link to='/leaderboard' className="btn text-light border btn-lg me-3">Leader Board</Link>
                <Link to='/mystories' className="btn text-light border btn-lg me-3">My Stories</Link>
                <button onClick={handleLogout} className="btn text-light border btn-lg">Logout</button>
            </div>
        </div>
    );
};

export default UserHome;