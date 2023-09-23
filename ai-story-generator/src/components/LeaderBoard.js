import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { HandThumbsUpFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const LeaderBoard = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/leaderboard').then((response) => {
      setStories(response.data);
    }).catch(function (err) {
      console.log(err);
    })
  }, []);

  return (
    <div className="container-fluid glowing-back text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="card w-75 bg-transparent text-light" >
      <div className="p-4 d-flex flex-row justify-content-between align-items-center">
        <h1 className="display-4">
          LeaderBoard
        </h1>
        <Link to="/" className="btn text-light border">Home</Link>
      </div>
        <div className=" px-0">
          <div>
            <div className="d-flex p-3 border-bottom">
              <div className="d-flex flex-column w-100 ps-3">
                {stories.map((story , count) => {
                  return (
                    <div key={story.storyid}>
                      <div className="card border mb-3 shadow-0">
                        <div className="row g-0">
                            <h6 className="text-body border-bottom">
                              <div className='w-100 mb-0 d-flex justify-content-between'>
                                <span className=" text-muted font-weight-normal p-2"><strong>{count+1}</strong></span>
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

export default LeaderBoard;