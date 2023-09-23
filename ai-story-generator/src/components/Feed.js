import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { HandThumbsUpFill } from 'react-bootstrap-icons';
import { Link,  useNavigate } from 'react-router-dom';

const Feed = () => {
  const [stories, setStories] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/getfeed').then((response) => {
      setStories(response.data);
    }).catch(function (err) {
      console.log(err);
    })
  }, []);

  const handleUpVote = (e, storyid) => {
      axios.post('http://127.0.0.1:5000/upvote', {
        storyid: storyid
      }, {
        headers: {
          'x-access-token': localStorage.getItem('jwt')
        }
      }).then((response) => {
        if(response.data.status===200)
        {
          document.getElementById(response.data.message['_id']).innerText = response.data.message['upvotes'];
        }
        else if(response.data.status === 401)
        {
          nav('/login');
        }
        else
        {
          alert(response.data.message);
        }
      }).catch((err) => {
        alert(err);
      })
  }

  return (
    <div className="container-fluid glowing-back text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="card w-75 bg-transparent text-light" >
        <div className=" px-0">
          <div className="p-3 border-bottom d-flex flex-row justify-content-between align-items-center">
            <h1 className="display-4 d-flex align-items-center mb-0">
              Story Feed
            </h1>
            <Link to="/" className="btn border text-light">Home</Link>
          </div>
          <div>
            <div className="d-flex p-3 border-bottom">
              <div className="d-flex flex-column w-100 ps-3">
                {stories.map((story) => {
                  return (
                    <div key={story.storyid}>
                      <div className="card border mb-3 shadow-0">
                        <div className="row g-0">
                          <div className="col-md-3">
                            <img src="https://source.unsplash.com/random/300x300/?abstract" alt="Avatar"
                              className="img-fluid rounded-left" />
                          </div>
                          <div className="col-md-9">
                            <h6 className="text-body border-bottom">
                              <div className='w-100 mb-0 d-flex justify-content-between'>
                                <span className=" text-muted font-weight-normal p-2">@<strong>{story.username}</strong></span>
                                <div className='p-2'>
                                  <span className=" text-muted font-weight-normal p-2">{story.creationtime}</span>
                                  <button className='btn btn-sm bg-transparent' onClick={(e) => handleUpVote(e, story.storyid)} upvote="1" >< HandThumbsUpFill /><span className=" mb-0 small ps-2 text-success"><strong id={story.storyid}>{story.upvotes}</strong></span></button>
                                </div>
                              </div>
                            </h6>
                            <div className="card-body w-100">
                              <p className="card-text small " >
                                {story.story}
                              </p>
                            </div>
                          </div>
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

export default Feed;
