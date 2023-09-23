import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { HandThumbsUpFill } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';

const MyStories = () => {
    const [stories, setStories] = useState([]);
    const [User, setUser] = useState(null);
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
                axios.get('http://127.0.0.1:5000/mystories', {
                    headers: {
                        'x-access-token': localStorage.getItem('jwt')
                    }
                }).then((response) => {
                    setStories(response.data);
                }).catch(function (err) {
                    console.log(err);
                })
            }
        })
    }, [nav])

    return (
        <div className="container-fluid glowing-back text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <div className="card w-75 bg-transparent text-light" >
            <div className="p-4 d-flex flex-row align-items-center justify-content-between">
                <h1 className="display-4">
                    My Stories
                </h1>
                <Link to="/" className="btn text-light border">Home</Link>
            </div>
                <div className=" px-0">
                    <div>
                        <div className="d-flex p-3 border-bottom">
                            <div className="d-flex flex-column w-100 ps-3">
                                {stories.map((story, count) => {
                                    return (
                                        <div key={story.storyid}>
                                            <div className="card border mb-3 shadow-0">
                                                <div className="row g-0">
                                                    <h6 className="text-body border-bottom">
                                                        <div className='w-100 mb-0 d-flex justify-content-between'>
                                                            <span className=" text-muted font-weight-normal p-2"><strong>{count + 1}</strong></span>
                                                            <span className=" text-muted font-weight-normal p-2">@<strong>{story.username}</strong></span>
                                                            <div className='p-2'>
                                                                <span className=" text-muted font-weight-normal p-2">< HandThumbsUpFill />{story.upvotes}</span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                    <div className="card-body w-100">
                                                        <p className="card-text small " >
                                                            {story.story}
                                                        </p>
                                                    </div>
                                                    {/* </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyStories;